// Server types definitions

export interface Server {
  id: string;
  name: string;
  host: string;
  port: number;
  username: string;
  status: string;
  type: string;
  region: string;
  storageUsed: number;
  storageTotal: string;
  lastConnection: string;
  created: string;
  expires: string;
  ipWhitelist: string[];
  autoTerminate: boolean;
  strictHostKeyChecking: boolean;
}

export interface ServerCredentials {
  host: string;
  port: number;
  username: string;
  privateKey?: string;
}

export interface ServerProvisionConfig {
  name: string;
  region: string;
  storage: string;
  username: string;
  ipWhitelist: string[];
  sshKeyOption: 'generate' | 'upload';
  publicKey?: string;
  expiry: {
    type: 'duration' | 'manual';
    duration?: number;
    afterExpiry?: 'destroy' | 'preserve' | 'archive';
  };
  autoTerminate: boolean;
  sendNotification: boolean;
  strictHostKeyChecking: boolean;
}
