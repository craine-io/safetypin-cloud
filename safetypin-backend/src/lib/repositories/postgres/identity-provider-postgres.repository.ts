import { PoolClient } from 'pg';
import { BasePostgresRepository } from './base-postgres.repository';
import { IdentityProviderRepository } from '../identity-provider.repository';
import { 
  IdentityProvider,
  CreateIdentityProviderDto,
  UpdateIdentityProviderDto,
  IdentityProviderMapping,
  CreateIdentityProviderMappingDto,
  IdentityProviderType,
  IdentityProviderStatus
} from '../../../models/auth/identity-provider.model';
import { query, transaction } from '../../database/config';

export class IdentityProviderPostgresRepository extends BasePostgresRepository<IdentityProvider, CreateIdentityProviderDto, UpdateIdentityProviderDto> implements IdentityProviderRepository {
  constructor() {
    super('identity_providers');
  }
  
  protected mapToEntity(row: any): IdentityProvider {
    return {
      id: row.id,
      organizationId: row.organization_id,
      name: row.name,
      type: row.type as IdentityProviderType,
      issuerUrl: row.issuer_url,
      entityId: row.entity_id,
      metadataUrl: row.metadata_url,
      clientId: row.client_id,
      clientSecret: row.client_secret,
      discoveryUrl: row.discovery_url,
      certificate: row.certificate,
      status: row.status as IdentityProviderStatus,
      creationTime: row.creation_time,
      lastUpdateTime: row.last_update_time,
      isDefault: row.is_default,
      configuration: row.configuration ? JSON.parse(row.configuration) : null
    };
  }
  
  protected mapToCreateQuery(dto: CreateIdentityProviderDto): { query: string; params: any[] } {
    const id = this.generateId();
    const params = [
      id,
      dto.organizationId,
      dto.name,
      dto.type,
      dto.issuerUrl || null,
      dto.entityId || null,
      dto.metadataUrl || null,
      dto.clientId || null,
      dto.clientSecret || null,
      dto.discoveryUrl || null,
      dto.certificate || null,
      dto.status || IdentityProviderStatus.CONFIGURED,
      dto.isDefault || false,
      dto.configuration ? JSON.stringify(dto.configuration) : null
    ];
    
    const query = `
      INSERT INTO identity_providers (
        id, organization_id, name, type, issuer_url, entity_id, metadata_url,
        client_id, client_secret, discovery_url, certificate, status, is_default, configuration
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;
    
    return { query, params };
  }
  
  protected mapToUpdateQuery(dto: UpdateIdentityProviderDto): { setClause: string; params: any[] } {
    const updates: string[] = [];
    const params: any[] = [];
    
    if (dto.name !== undefined) {
      params.push(dto.name);
      updates.push(`name = $${params.length}`);
    }
    
    if (dto.issuerUrl !== undefined) {
      params.push(dto.issuerUrl);
      updates.push(`issuer_url = $${params.length}`);
    }
    
    if (dto.entityId !== undefined) {
      params.push(dto.entityId);
      updates.push(`entity_id = $${params.length}`);
    }
    
    if (dto.metadataUrl !== undefined) {
      params.push(dto.metadataUrl);
      updates.push(`metadata_url = $${params.length}`);
    }
    
    if (dto.clientId !== undefined) {
      params.push(dto.clientId);
      updates.push(`client_id = $${params.length}`);
    }
    
    if (dto.clientSecret !== undefined) {
      params.push(dto.clientSecret);
      updates.push(`client_secret = $${params.length}`);
    }
    
    if (dto.discoveryUrl !== undefined) {
      params.push(dto.discoveryUrl);
      updates.push(`discovery_url = $${params.length}`);
    }
    
    if (dto.certificate !== undefined) {
      params.push(dto.certificate);
      updates.push(`certificate = $${params.length}`);
    }
    
    if (dto.status !== undefined) {
      params.push(dto.status);
      updates.push(`status = $${params.length}`);
    }
    
    if (dto.isDefault !== undefined) {
      params.push(dto.isDefault);
      updates.push(`is_default = $${params.length}`);
    }
    
    if (dto.configuration !== undefined) {
      params.push(dto.configuration ? JSON.stringify(dto.configuration) : null);
      updates.push(`configuration = $${params.length}`);
    }
    
    const setClause = updates.join(', ');
    
    return { setClause, params };
  }
  
  protected getTransactionRepository(client: PoolClient): IdentityProviderRepository {
    // Create a transaction-specific repository that uses the client
    const transactionRepo = new IdentityProviderPostgresRepository();
    
    // Override methods to use the provided client
    const originalQuery = transactionRepo.findById;
    transactionRepo.findById = async (id: string) => {
      const result = await client.query(
        `SELECT * FROM ${this.tableName} WHERE ${this.idField} = $1`,
        [id]
      );
      
      return result.rows.length > 0 ? this.mapToEntity(result.rows[0]) : null;
    };
    
    // Override other methods similarly as needed for transactions
    
    return transactionRepo;
  }
  
  // Identity Provider repository specific methods
  async findByOrganizationId(organizationId: string): Promise<IdentityProvider[]> {
    const result = await query(
      `SELECT * FROM identity_providers WHERE organization_id = $1`,
      [organizationId]
    );
    
    return result.rows.map(row => this.mapToEntity(row));
  }
  
  async findDefaultForOrganization(organizationId: string): Promise<IdentityProvider | null> {
    const result = await query(
      `SELECT * FROM identity_providers 
       WHERE organization_id = $1 AND is_default = true`,
      [organizationId]
    );
    
    return result.rows.length > 0 ? this.mapToEntity(result.rows[0]) : null;
  }
  
  async setAsDefault(id: string): Promise<IdentityProvider | null> {
    return await transaction(async (client) => {
      // First get the provider to find the organization ID
      const providerResult = await client.query(
        `SELECT * FROM identity_providers WHERE id = $1`,
        [id]
      );
      
      if (providerResult.rows.length === 0) {
        return null;
      }
      
      const organizationId = providerResult.rows[0].organization_id;
      
      // Clear default flag for all providers in the organization
      await client.query(
        `UPDATE identity_providers 
         SET is_default = false, last_update_time = CURRENT_TIMESTAMP
         WHERE organization_id = $1`,
        [organizationId]
      );
      
      // Set the target provider as default
      const result = await client.query(
        `UPDATE identity_providers 
         SET is_default = true, last_update_time = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING *`,
        [id]
      );
      
      return result.rows.length > 0 ? this.mapToEntity(result.rows[0]) : null;
    });
  }
  
  async validateConfiguration(id: string): Promise<{ valid: boolean; message?: string }> {
    // In a real implementation, this would perform validation specific to the provider type
    // For now, we'll just check if the provider exists and has the necessary fields based on type
    const provider = await this.findById(id);
    
    if (!provider) {
      return { valid: false, message: 'Identity provider not found' };
    }
    
    switch (provider.type) {
      case IdentityProviderType.SAML:
        if (!provider.entityId || !provider.certificate) {
          return { 
            valid: false, 
            message: 'SAML provider requires entityId and certificate' 
          };
        }
        break;
        
      case IdentityProviderType.OIDC:
      case IdentityProviderType.AZURE_AD:
      case IdentityProviderType.GOOGLE:
      case IdentityProviderType.OKTA:
      case IdentityProviderType.AUTH0:
        if (!provider.clientId || !provider.clientSecret) {
          return { 
            valid: false, 
            message: 'OAuth provider requires clientId and clientSecret' 
          };
        }
        break;
    }
    
    return { valid: true };
  }
  
  // Identity Provider Mapping methods
  async createMapping(dto: CreateIdentityProviderMappingDto): Promise<IdentityProviderMapping> {
    const id = this.generateId();
    
    const result = await query(
      `INSERT INTO identity_provider_mappings (
        id, identity_provider_id, external_id, user_id, email, external_attributes
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        id, 
        dto.identityProviderId, 
        dto.externalId, 
        dto.userId, 
        dto.email, 
        dto.externalAttributes ? JSON.stringify(dto.externalAttributes) : null
      ]
    );
    
    return {
      id: result.rows[0].id,
      identityProviderId: result.rows[0].identity_provider_id,
      externalId: result.rows[0].external_id,
      userId: result.rows[0].user_id,
      email: result.rows[0].email,
      creationTime: result.rows[0].creation_time,
      lastLoginTime: result.rows[0].last_login_time,
      externalAttributes: result.rows[0].external_attributes ? JSON.parse(result.rows[0].external_attributes) : null
    };
  }
  
  async findMappingByExternalId(providerId: string, externalId: string): Promise<IdentityProviderMapping | null> {
    const result = await query(
      `SELECT * FROM identity_provider_mappings
       WHERE identity_provider_id = $1 AND external_id = $2`,
      [providerId, externalId]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return {
      id: result.rows[0].id,
      identityProviderId: result.rows[0].identity_provider_id,
      externalId: result.rows[0].external_id,
      userId: result.rows[0].user_id,
      email: result.rows[0].email,
      creationTime: result.rows[0].creation_time,
      lastLoginTime: result.rows[0].last_login_time,
      externalAttributes: result.rows[0].external_attributes ? JSON.parse(result.rows[0].external_attributes) : null
    };
  }
  
  async findMappingsByUserId(userId: string): Promise<IdentityProviderMapping[]> {
    const result = await query(
      `SELECT * FROM identity_provider_mappings
       WHERE user_id = $1`,
      [userId]
    );
    
    return result.rows.map(row => ({
      id: row.id,
      identityProviderId: row.identity_provider_id,
      externalId: row.external_id,
      userId: row.user_id,
      email: row.email,
      creationTime: row.creation_time,
      lastLoginTime: row.last_login_time,
      externalAttributes: row.external_attributes ? JSON.parse(row.external_attributes) : null
    }));
  }
  
  async findMappingsByEmail(email: string): Promise<IdentityProviderMapping[]> {
    const result = await query(
      `SELECT * FROM identity_provider_mappings
       WHERE email = $1`,
      [email]
    );
    
    return result.rows.map(row => ({
      id: row.id,
      identityProviderId: row.identity_provider_id,
      externalId: row.external_id,
      userId: row.user_id,
      email: row.email,
      creationTime: row.creation_time,
      lastLoginTime: row.last_login_time,
      externalAttributes: row.external_attributes ? JSON.parse(row.external_attributes) : null
    }));
  }
  
  async updateMapping(id: string, data: Partial<IdentityProviderMapping>): Promise<IdentityProviderMapping | null> {
    const updates: string[] = [];
    const params: any[] = [];
    
    if (data.externalId !== undefined) {
      params.push(data.externalId);
      updates.push(`external_id = $${params.length}`);
    }
    
    if (data.userId !== undefined) {
      params.push(data.userId);
      updates.push(`user_id = $${params.length}`);
    }
    
    if (data.email !== undefined) {
      params.push(data.email);
      updates.push(`email = $${params.length}`);
    }
    
    if (data.externalAttributes !== undefined) {
      params.push(data.externalAttributes ? JSON.stringify(data.externalAttributes) : null);
      updates.push(`external_attributes = $${params.length}`);
    }
    
    if (updates.length === 0) {
      // Nothing to update
      const existing = await query(
        `SELECT * FROM identity_provider_mappings WHERE id = $1`,
        [id]
      );
      
      if (existing.rows.length === 0) {
        return null;
      }
      
      const row = existing.rows[0];
      return {
        id: row.id,
        identityProviderId: row.identity_provider_id,
        externalId: row.external_id,
        userId: row.user_id,
        email: row.email,
        creationTime: row.creation_time,
        lastLoginTime: row.last_login_time,
        externalAttributes: row.external_attributes ? JSON.parse(row.external_attributes) : null
      };
    }
    
    params.push(id);
    
    const result = await query(
      `UPDATE identity_provider_mappings
       SET ${updates.join(', ')}
       WHERE id = $${params.length}
       RETURNING *`,
      params
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const row = result.rows[0];
    return {
      id: row.id,
      identityProviderId: row.identity_provider_id,
      externalId: row.external_id,
      userId: row.user_id,
      email: row.email,
      creationTime: row.creation_time,
      lastLoginTime: row.last_login_time,
      externalAttributes: row.external_attributes ? JSON.parse(row.external_attributes) : null
    };
  }
  
  async deleteMapping(id: string): Promise<boolean> {
    const result = await query(
      `DELETE FROM identity_provider_mappings
       WHERE id = $1`,
      [id]
    );
    
    return result.rowCount > 0;
  }
  
  async updateLastLogin(mappingId: string): Promise<boolean> {
    const result = await query(
      `UPDATE identity_provider_mappings
       SET last_login_time = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [mappingId]
    );
    
    return result.rowCount > 0;
  }
  
  async updateMetadata(id: string): Promise<IdentityProvider | null> {
    // This would typically fetch metadata from the SSO provider's metadata URL
    // and update the local configuration
    // For now, we'll just return the provider
    return this.findById(id);
  }
  
  async findByEntityId(entityId: string): Promise<IdentityProvider | null> {
    const result = await query(
      `SELECT * FROM identity_providers
       WHERE entity_id = $1`,
      [entityId]
    );
    
    return result.rows.length > 0 ? this.mapToEntity(result.rows[0]) : null;
  }
  
  async findByIssuerUrl(issuerUrl: string): Promise<IdentityProvider | null> {
    const result = await query(
      `SELECT * FROM identity_providers
       WHERE issuer_url = $1`,
      [issuerUrl]
    );
    
    return result.rows.length > 0 ? this.mapToEntity(result.rows[0]) : null;
  }
}
