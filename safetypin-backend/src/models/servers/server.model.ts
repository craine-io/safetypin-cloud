// Server model definitions

export interface Server {
  id: string;
  organizationId: string;
  name: string;
  host: string;
  status: 'Online' | 'Offline' | 'Maintenance' | 'Provisioning';
  type: string;
  storageUsed: number;
  storageLimit: number;
  lastConnection: string;
  region: string;
  username: string;
  creationTime: Date;
  lastUpdateTime: Date;
  expiryTime?: Date;
  lifecycleStatus?: string;
  securitySettings?: ServerSecuritySettings;
  lifecycleSettings?: ServerLifecycleSettings;
  cloudProviderId?: string;
  cloudCredentialId?: string;
  cloudResourceId?: string;
}

export interface ServerSecuritySettings {
  whitelistedIps: string[];
  sshKeyType: 'generate' | 'upload';
  sshPublicKey?: string;
  strictHostChecking?: boolean;
}

export interface ServerLifecycleSettings {
  expiryType: 'duration' | 'manual';
  duration?: number;
  afterExpiry?: 'destroy' | 'preserve' | 'archive';
  autoTerminate: boolean;
  sendNotification: boolean;
}

export interface CreateServerDto {
  organizationId: string;
  name: string;
  region: string;
  storageSize: number;
  username: string;
  securityOptions?: {
    whitelistedIps: string[];
    sshKeyType: 'generate' | 'upload';
    sshPublicKey?: string;
    strictHostChecking?: boolean;
  };
  lifecycleOptions?: {
    expiryType: 'duration' | 'manual';
    duration?: number;
    afterExpiry?: 'destroy' | 'preserve' | 'archive';
    autoTerminate: boolean;
    sendNotification: boolean;
  };
  cloudProviderId?: string;
  cloudCredentialId?: string;
}

export interface UpdateServerDto {
  name?: string;
  status?: 'Online' | 'Offline' | 'Maintenance' | 'Provisioning';
  storageUsed?: number;
  storageLimit?: number;
  securitySettings?: Partial<ServerSecuritySettings>;
  lifecycleSettings?: Partial<ServerLifecycleSettings>;
}

export interface ServerProvisionResult {
  server: Server;
  credentials: {
    host: string;
    port: number;
    username: string;
    privateKey?: string;
  };
}
