import { PoolClient } from 'pg';
import { BasePostgresRepository } from './base-postgres.repository';
import { CloudProviderRepository, CloudCredentialRepository } from '../cloud.repository';
import { 
  CloudProvider,
  CloudProviderStatus,
  OrganizationCloudCredential,
  CreateCloudCredentialDto,
  UpdateCloudCredentialDto,
  CredentialStatus,
  VerifyCredentialResult
} from '../../../models/auth/cloud.model';
import { query, transaction } from '../../database/config';
import * as crypto from 'crypto';

// Cloud Provider Repository
export class CloudProviderPostgresRepository extends BasePostgresRepository<CloudProvider, any, any> implements CloudProviderRepository {
  constructor() {
    super('cloud_providers');
  }
  
  protected mapToEntity(row: any): CloudProvider {
    return {
      id: row.id,
      name: row.name,
      displayName: row.display_name,
      status: row.status as CloudProviderStatus,
      apiVersion: row.api_version,
      capabilities: row.capabilities ? JSON.parse(row.capabilities) : null
    };
  }
  
  protected mapToCreateQuery(dto: any): { query: string; params: any[] } {
    throw new Error('Creating cloud providers not supported through API');
  }
  
  protected mapToUpdateQuery(dto: any): { setClause: string; params: any[] } {
    throw new Error('Updating cloud providers not supported through API');
  }
  
  protected getTransactionRepository(client: PoolClient): CloudProviderRepository {
    const transactionRepo = new CloudProviderPostgresRepository();
    
    transactionRepo.findById = async (id: string) => {
      const result = await client.query(
        `SELECT * FROM ${this.tableName} WHERE ${this.idField} = $1`,
        [id]
      );
      
      return result.rows.length > 0 ? this.mapToEntity(result.rows[0]) : null;
    };
    
    return transactionRepo;
  }
  
  // Cloud Provider specific methods
  async findByName(name: string): Promise<CloudProvider | null> {
    const result = await query(
      `SELECT * FROM cloud_providers WHERE name = $1`,
      [name]
    );
    
    return result.rows.length > 0 ? this.mapToEntity(result.rows[0]) : null;
  }
  
  async findByCapability(capability: string): Promise<CloudProvider[]> {
    const result = await query(
      `SELECT * FROM cloud_providers 
       WHERE capabilities->>'${capability}' = 'true'
       AND status = 'active'`,
      []
    );
    
    return result.rows.map(row => this.mapToEntity(row));
  }
  
  async getActiveProviders(): Promise<CloudProvider[]> {
    const result = await query(
      `SELECT * FROM cloud_providers
       WHERE status = 'active'
       ORDER BY display_name ASC`,
      []
    );
    
    return result.rows.map(row => this.mapToEntity(row));
  }
}

// Cloud Credential Repository
export class CloudCredentialPostgresRepository extends BasePostgresRepository<OrganizationCloudCredential, CreateCloudCredentialDto, UpdateCloudCredentialDto> implements CloudCredentialRepository {
  private readonly encryptionKey: string;
  private readonly algorithm = 'aes-256-gcm';
  
  constructor() {
    super('organization_cloud_credentials');
    
    // In a real implementation, this key would come from a secure source
    // like AWS KMS, Azure Key Vault, or HashiCorp Vault
    this.encryptionKey = process.env.CREDENTIAL_ENCRYPTION_KEY || 'a-secure-encryption-key-should-be-used-in-production';
  }
  
  protected mapToEntity(row: any): OrganizationCloudCredential {
    return {
      id: row.id,
      organizationId: row.organization_id,
      cloudProviderId: row.cloud_provider_id,
      name: row.name,
      credentialType: row.credential_type,
      credentials: row.credentials, // Still encrypted
      creationTime: row.creation_time,
      createdBy: row.created_by,
      lastUpdateTime: row.last_update_time,
      updatedBy: row.updated_by,
      status: row.status,
      lastVerifiedTime: row.last_verified_time,
      isDefault: row.is_default
    };
  }
  
  protected mapToCreateQuery(dto: CreateCloudCredentialDto): { query: string; params: any[] } {
    const id = this.generateId();
    
    // Encrypt the credentials
    const encryptedCredentials = this.encryptCredentials(dto.credentials);
    
    const params = [
      id,
      dto.organizationId,
      dto.cloudProviderId,
      dto.name,
      dto.credentialType,
      encryptedCredentials,
      dto.createdBy || null,
      dto.isDefault !== undefined ? dto.isDefault : false
    ];
    
    const query = `
      INSERT INTO organization_cloud_credentials (
        id, organization_id, cloud_provider_id, name, credential_type,
        credentials, created_by, is_default
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    return { query, params };
  }
  
  protected mapToUpdateQuery(dto: UpdateCloudCredentialDto): { setClause: string; params: any[] } {
    const updates: string[] = [];
    const params: any[] = [];
    
    if (dto.name !== undefined) {
      params.push(dto.name);
      updates.push(`name = $${params.length}`);
    }
    
    if (dto.credentials !== undefined) {
      const encryptedCredentials = this.encryptCredentials(dto.credentials);
      params.push(encryptedCredentials);
      updates.push(`credentials = $${params.length}`);
    }
    
    if (dto.status !== undefined) {
      params.push(dto.status);
      updates.push(`status = $${params.length}`);
    }
    
    if (dto.updatedBy !== undefined) {
      params.push(dto.updatedBy);
      updates.push(`updated_by = $${params.length}`);
    }
    
    if (dto.isDefault !== undefined) {
      params.push(dto.isDefault);
      updates.push(`is_default = $${params.length}`);
    }
    
    const setClause = updates.join(', ');
    
    return { setClause, params };
  }
  
  protected getTransactionRepository(client: PoolClient): CloudCredentialRepository {
    const transactionRepo = new CloudCredentialPostgresRepository();
    
    transactionRepo.findById = async (id: string) => {
      const result = await client.query(
        `SELECT * FROM ${this.tableName} WHERE ${this.idField} = $1`,
        [id]
      );
      
      return result.rows.length > 0 ? this.mapToEntity(result.rows[0]) : null;
    };
    
    return transactionRepo;
  }
  
  // Cloud Credential encryption/decryption methods
  async encryptCredentials(credentials: any): Promise<any> {
    try {
      // Convert credentials to a string if it's an object
      const plaintext = typeof credentials === 'object' 
        ? JSON.stringify(credentials)
        : credentials.toString();
        
      // Generate a random initialization vector
      const iv = crypto.randomBytes(16);
      
      // Create a cipher using the encryption key and iv
      const cipher = crypto.createCipheriv(
        this.algorithm, 
        Buffer.from(this.encryptionKey, 'utf8').slice(0, 32), 
        iv
      );
      
      // Encrypt the credentials
      let encrypted = cipher.update(plaintext, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      // Get the authentication tag
      const authTag = cipher.getAuthTag();
      
      // Return the encrypted data with iv and auth tag
      return {
        iv: iv.toString('hex'),
        encryptedData: encrypted,
        authTag: authTag.toString('hex')
      };
    } catch (error) {
      console.error('Error encrypting credentials:', error);
      throw new Error('Failed to encrypt credentials');
    }
  }
  
  async decryptCredentials(encryptedCredentials: any): Promise<any> {
    try {
      // Extract the iv, encrypted data, and auth tag
      const { iv, encryptedData, authTag } = encryptedCredentials;
      
      // Create a decipher using the encryption key and iv
      const decipher = crypto.createDecipheriv(
        this.algorithm,
        Buffer.from(this.encryptionKey, 'utf8').slice(0, 32),
        Buffer.from(iv, 'hex')
      );
      
      // Set the auth tag
      decipher.setAuthTag(Buffer.from(authTag, 'hex'));
      
      // Decrypt the data
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      // Try to parse as JSON if it looks like a JSON object
      try {
        if (decrypted.startsWith('{') || decrypted.startsWith('[')) {
          return JSON.parse(decrypted);
        }
      } catch (e) {
        // If parsing fails, just return the string
      }
      
      return decrypted;
    } catch (error) {
      console.error('Error decrypting credentials:', error);
      throw new Error('Failed to decrypt credentials');
    }
  }
  
  // Cloud Credential specific methods
  async findByOrganizationId(organizationId: string): Promise<OrganizationCloudCredential[]> {
    const result = await query(
      `SELECT * FROM organization_cloud_credentials
       WHERE organization_id = $1
       ORDER BY name ASC`,
      [organizationId]
    );
    
    return result.rows.map(row => this.mapToEntity(row));
  }
  
  async findDefaultForProvider(organizationId: string, providerId: string): Promise<OrganizationCloudCredential | null> {
    const result = await query(
      `SELECT * FROM organization_cloud_credentials
       WHERE organization_id = $1
       AND cloud_provider_id = $2
       AND is_default = true
       AND status = 'active'
       LIMIT 1`,
      [organizationId, providerId]
    );
    
    return result.rows.length > 0 ? this.mapToEntity(result.rows[0]) : null;
  }
  
  async setAsDefault(id: string): Promise<OrganizationCloudCredential | null> {
    return await transaction(async (client) => {
      // First get the credential to find the organization and provider IDs
      const credentialResult = await client.query(
        `SELECT * FROM organization_cloud_credentials
         WHERE id = $1`,
        [id]
      );
      
      if (credentialResult.rows.length === 0) {
        return null;
      }
      
      const { organization_id, cloud_provider_id } = credentialResult.rows[0];
      
      // Clear default flag for all credentials for this provider in this organization
      await client.query(
        `UPDATE organization_cloud_credentials
         SET is_default = false
         WHERE organization_id = $1
         AND cloud_provider_id = $2`,
        [organization_id, cloud_provider_id]
      );
      
      // Set the target credential as default
      const result = await client.query(
        `UPDATE organization_cloud_credentials
         SET is_default = true,
             last_update_time = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING *`,
        [id]
      );
      
      return result.rows.length > 0 ? this.mapToEntity(result.rows[0]) : null;
    });
  }
  
  async verifyCredential(id: string): Promise<VerifyCredentialResult> {
    // In a real implementation, this would attempt to connect to the cloud provider
    // and verify the credentials by making a test API call
    // For now, we'll just update the last verified time
    
    const result = await query(
      `UPDATE organization_cloud_credentials
       SET last_verified_time = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return {
        valid: false,
        error: 'Credential not found'
      };
    }
    
    // For demo purposes, we'll assume all credentials are valid
    return {
      valid: true
    };
  }
  
  async getCredentials(id: string): Promise<any | null> {
    const credential = await this.findById(id);
    
    if (!credential) {
      return null;
    }
    
    // Decrypt the credentials
    return this.decryptCredentials(credential.credentials);
  }
  
  // Provider specific operations
  async getAwsCredentials(organizationId: string, useDefault = true): Promise<any | null> {
    // First find the AWS provider
    const providerRepository = new CloudProviderPostgresRepository();
    const awsProvider = await providerRepository.findByName('aws');
    
    if (!awsProvider) {
      return null;
    }
    
    // Find appropriate credentials
    let credential: OrganizationCloudCredential | null = null;
    
    if (useDefault) {
      credential = await this.findDefaultForProvider(organizationId, awsProvider.id);
    } else {
      const credentials = await this.findAll({
        organization_id: organizationId,
        cloud_provider_id: awsProvider.id,
        status: 'active'
      });
      
      credential = credentials.length > 0 ? credentials[0] : null;
    }
    
    if (!credential) {
      return null;
    }
    
    // Decrypt and return the credentials
    return this.decryptCredentials(credential.credentials);
  }
  
  async getAzureCredentials(organizationId: string, useDefault = true): Promise<any | null> {
    // Similar to getAwsCredentials but for Azure
    const providerRepository = new CloudProviderPostgresRepository();
    const azureProvider = await providerRepository.findByName('azure');
    
    if (!azureProvider) {
      return null;
    }
    
    let credential: OrganizationCloudCredential | null = null;
    
    if (useDefault) {
      credential = await this.findDefaultForProvider(organizationId, azureProvider.id);
    } else {
      const credentials = await this.findAll({
        organization_id: organizationId,
        cloud_provider_id: azureProvider.id,
        status: 'active'
      });
      
      credential = credentials.length > 0 ? credentials[0] : null;
    }
    
    if (!credential) {
      return null;
    }
    
    return this.decryptCredentials(credential.credentials);
  }
  
  async getGcpCredentials(organizationId: string, useDefault = true): Promise<any | null> {
    // Similar to getAwsCredentials but for GCP
    const providerRepository = new CloudProviderPostgresRepository();
    const gcpProvider = await providerRepository.findByName('gcp');
    
    if (!gcpProvider) {
      return null;
    }
    
    let credential: OrganizationCloudCredential | null = null;
    
    if (useDefault) {
      credential = await this.findDefaultForProvider(organizationId, gcpProvider.id);
    } else {
      const credentials = await this.findAll({
        organization_id: organizationId,
        cloud_provider_id: gcpProvider.id,
        status: 'active'
      });
      
      credential = credentials.length > 0 ? credentials[0] : null;
    }
    
    if (!credential) {
      return null;
    }
    
    return this.decryptCredentials(credential.credentials);
  }
}
