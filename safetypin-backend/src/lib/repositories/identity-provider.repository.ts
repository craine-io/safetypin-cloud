import { BaseRepository } from './base.repository';
import { 
  IdentityProvider,
  CreateIdentityProviderDto,
  UpdateIdentityProviderDto,
  IdentityProviderMapping,
  CreateIdentityProviderMappingDto
} from '../../models/auth/identity-provider.model';

export interface IdentityProviderRepository extends BaseRepository<IdentityProvider, CreateIdentityProviderDto, UpdateIdentityProviderDto> {
  // Find by organization
  findByOrganizationId(organizationId: string): Promise<IdentityProvider[]>;
  
  // Find default provider for organization
  findDefaultForOrganization(organizationId: string): Promise<IdentityProvider | null>;
  
  // Set as default
  setAsDefault(id: string): Promise<IdentityProvider | null>;
  
  // Configuration management
  validateConfiguration(id: string): Promise<{ valid: boolean; message?: string }>;
  
  // Identity provider mappings
  createMapping(dto: CreateIdentityProviderMappingDto): Promise<IdentityProviderMapping>;
  findMappingByExternalId(providerId: string, externalId: string): Promise<IdentityProviderMapping | null>;
  findMappingsByUserId(userId: string): Promise<IdentityProviderMapping[]>;
  findMappingsByEmail(email: string): Promise<IdentityProviderMapping[]>;
  updateMapping(id: string, data: Partial<IdentityProviderMapping>): Promise<IdentityProviderMapping | null>;
  deleteMapping(id: string): Promise<boolean>;
  
  // Login tracking
  updateLastLogin(mappingId: string): Promise<boolean>;
  
  // Metadata management
  updateMetadata(id: string): Promise<IdentityProvider | null>;
  
  // Findable by entity ID (for SAML)
  findByEntityId(entityId: string): Promise<IdentityProvider | null>;
  
  // Find by issuer URL
  findByIssuerUrl(issuerUrl: string): Promise<IdentityProvider | null>;
}
