// Identity Provider model for SSO configurations

export interface IdentityProvider {
  id: string;
  organizationId: string;
  name: string;
  type: IdentityProviderType;
  issuerUrl: string | null;
  entityId: string | null;
  metadataUrl: string | null;
  clientId: string | null;
  clientSecret: string | null;
  discoveryUrl: string | null;
  certificate: string | null;
  status: IdentityProviderStatus;
  creationTime: Date;
  lastUpdateTime: Date;
  isDefault: boolean;
  configuration: IdentityProviderConfiguration | null;
}

export enum IdentityProviderType {
  SAML = 'saml',
  OIDC = 'oidc',
  AZURE_AD = 'azure_ad',
  GOOGLE = 'google',
  OKTA = 'okta',
  AUTH0 = 'auth0',
  CUSTOM = 'custom'
}

export enum IdentityProviderStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CONFIGURED = 'configured',
  ERROR = 'error'
}

export interface IdentityProviderConfiguration {
  // SAML specific configuration
  saml?: {
    nameIDFormat: string;
    signatureAlgorithm: string;
    digestAlgorithm: string;
    authnContextClassRef: string;
    identifierFormat: string;
    attributeMapping: {
      email?: string;
      firstName?: string;
      lastName?: string;
      groups?: string;
      roles?: string;
    };
  };
  
  // OIDC specific configuration
  oidc?: {
    scopes: string[];
    responseType: string;
    tokenEndpointAuthMethod: string;
    claimsMapping: {
      email?: string;
      firstName?: string;
      lastName?: string;
      groups?: string;
      roles?: string;
    };
  };
  
  // Provider-specific configurations
  [key: string]: any;
}

export interface CreateIdentityProviderDto {
  organizationId: string;
  name: string;
  type: IdentityProviderType;
  issuerUrl?: string;
  entityId?: string;
  metadataUrl?: string;
  clientId?: string;
  clientSecret?: string;
  discoveryUrl?: string;
  certificate?: string;
  status?: IdentityProviderStatus;
  isDefault?: boolean;
  configuration?: IdentityProviderConfiguration;
}

export interface UpdateIdentityProviderDto {
  name?: string;
  issuerUrl?: string;
  entityId?: string;
  metadataUrl?: string;
  clientId?: string;
  clientSecret?: string;
  discoveryUrl?: string;
  certificate?: string;
  status?: IdentityProviderStatus;
  isDefault?: boolean;
  configuration?: IdentityProviderConfiguration;
}

export interface IdentityProviderMapping {
  id: string;
  identityProviderId: string;
  externalId: string;
  userId: string;
  email: string;
  creationTime: Date;
  lastLoginTime: Date | null;
  externalAttributes: any | null;
}

export interface CreateIdentityProviderMappingDto {
  identityProviderId: string;
  externalId: string;
  userId: string;
  email: string;
  externalAttributes?: any;
}
