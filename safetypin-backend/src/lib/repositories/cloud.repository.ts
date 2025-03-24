import { BaseRepository } from './base.repository';
import { 
  CloudProvider,
  OrganizationCloudCredential,
  CreateCloudCredentialDto,
  UpdateCloudCredentialDto,
  VerifyCredentialResult
} from '../../models/auth/cloud.model';

export interface CloudProviderRepository extends BaseRepository<CloudProvider, any, any> {
  // Find by name
  findByName(name: string): Promise<CloudProvider | null>;
  
  // Find by capability
  findByCapability(capability: string): Promise<CloudProvider[]>;
  
  // Get active providers
  getActiveProviders(): Promise<CloudProvider[]>;
}

export interface CloudCredentialRepository extends BaseRepository<OrganizationCloudCredential, CreateCloudCredentialDto, UpdateCloudCredentialDto> {
  // Find by organization
  findByOrganizationId(organizationId: string): Promise<OrganizationCloudCredential[]>;
  
  // Find default credential for provider
  findDefaultForProvider(organizationId: string, providerId: string): Promise<OrganizationCloudCredential | null>;
  
  // Set as default
  setAsDefault(id: string): Promise<OrganizationCloudCredential | null>;
  
  // Credential verification
  verifyCredential(id: string): Promise<VerifyCredentialResult>;
  
  // Credential encryption/decryption
  encryptCredentials(credentials: any): Promise<any>;
  decryptCredentials(encryptedCredentials: any): Promise<any>;
  
  // Get and decrypt credentials
  getCredentials(id: string): Promise<any | null>;
  
  // Provider specific operations
  getAwsCredentials(organizationId: string, useDefault?: boolean): Promise<any | null>;
  getAzureCredentials(organizationId: string, useDefault?: boolean): Promise<any | null>;
  getGcpCredentials(organizationId: string, useDefault?: boolean): Promise<any | null>;
}
