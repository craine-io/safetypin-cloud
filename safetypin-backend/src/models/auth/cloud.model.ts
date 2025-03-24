// Cloud provider models for multi-cloud integration

export interface CloudProvider {
  id: string;
  name: string;
  displayName: string;
  status: CloudProviderStatus;
  apiVersion: string | null;
  capabilities: CloudProviderCapabilities | null;
}

export enum CloudProviderStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DEPRECATED = 'deprecated'
}

export interface CloudProviderCapabilities {
  sftp: boolean;
  s3?: boolean;
  blobStorage?: boolean;
  cloudStorage?: boolean;
  transferFamily?: boolean;
  [key: string]: any;
}

export interface OrganizationCloudCredential {
  id: string;
  organizationId: string;
  cloudProviderId: string;
  name: string;
  credentialType: CredentialType;
  credentials: any; // Encrypted credentials
  creationTime: Date;
  createdBy: string | null;
  lastUpdateTime: Date;
  updatedBy: string | null;
  status: CredentialStatus;
  lastVerifiedTime: Date | null;
  isDefault: boolean;
}

export enum CredentialType {
  API_KEY = 'api_key',
  SERVICE_PRINCIPAL = 'service_principal',
  OAUTH = 'oauth',
  ROLE_ARN = 'role_arn',
  SERVICE_ACCOUNT = 'service_account',
  CUSTOM = 'custom'
}

export enum CredentialStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error',
  EXPIRED = 'expired',
  REVOKED = 'revoked'
}

export interface CreateCloudCredentialDto {
  organizationId: string;
  cloudProviderId: string;
  name: string;
  credentialType: CredentialType;
  credentials: any;
  createdBy?: string;
  isDefault?: boolean;
}

export interface UpdateCloudCredentialDto {
  name?: string;
  credentials?: any;
  status?: CredentialStatus;
  updatedBy?: string;
  isDefault?: boolean;
}

export interface VerifyCredentialResult {
  valid: boolean;
  error?: string;
  details?: any;
}

// AWS specific models
export interface AwsCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  sessionToken?: string;
}

// Azure specific models
export interface AzureCredentials {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  subscriptionId: string;
}

// GCP specific models
export interface GcpCredentials {
  type: string;
  projectId: string;
  privateKeyId: string;
  privateKey: string;
  clientEmail: string;
  clientId: string;
  authUri: string;
  tokenUri: string;
  authProviderX509CertUrl: string;
  clientX509CertUrl: string;
}
