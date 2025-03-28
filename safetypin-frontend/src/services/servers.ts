// Server service implementation
import api from './api';

// Types
export interface Server {
  id: string;
  name: string;
  host: string;
  status: 'Online' | 'Offline' | 'Maintenance' | 'Provisioning';
  type: string;
  storageUsed: number;
  lastConnection: string;
  region?: string;
  username?: string;
}

export interface ServerCreationParams {
  name: string;
  region: string;
  storageSize: number;
  username?: string;
  securityOptions?: {
    whitelistedIps: string[];
    sshKeyType: 'generate' | 'upload';
    sshPublicKey?: string;
  };
  lifecycleOptions?: {
    expiryType: 'duration' | 'manual';
    duration?: number;
    afterExpiry?: 'destroy' | 'preserve' | 'archive';
    autoTerminate: boolean;
    sendNotification: boolean;
  };
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

// Server mock data
const mockServers: Server[] = [
  {
    id: 'srv-001',
    name: 'Production Server',
    host: 'prod.example.com',
    status: 'Online',
    type: 'SFTP',
    storageUsed: 85,
    lastConnection: '10 minutes ago',
    region: 'us-east-1',
    username: 'sftp-user',
  },
  {
    id: 'srv-002',
    name: 'Development Server',
    host: 'dev.example.com',
    status: 'Online',
    type: 'SFTP',
    storageUsed: 42,
    lastConnection: '3 hours ago',
    region: 'us-west-1',
    username: 'sftp-user',
  },
  {
    id: 'srv-003',
    name: 'Testing Server',
    host: 'test.example.com',
    status: 'Offline',
    type: 'SFTP',
    storageUsed: 0,
    lastConnection: '2 days ago',
    region: 'eu-west-1',
    username: 'sftp-user',
  },
  {
    id: 'srv-004',
    name: 'Backup Server',
    host: 'backup.example.com',
    status: 'Online',
    type: 'SFTP',
    storageUsed: 67,
    lastConnection: '5 hours ago',
    region: 'us-east-1',
    username: 'sftp-user',
  },
];

class ServerService {
  // Get all servers
  async getServers(): Promise<Server[]> {
    console.log('getServers called, mock mode:', api.shouldUseMockData());
    console.log('API base URL:', api.getBaseUrl());

    // Use mock data if in mock mode
    if (api.shouldUseMockData()) {
      console.log('Using mock data');
      return Promise.resolve([...mockServers]);
    }

    // Call the real API
    try {
      console.log('Attempting to fetch servers from API...');
      // Try the debug endpoint first
      try {
        console.log('Trying debug endpoint');
        const debugResponse = await fetch(api.getBaseUrl() + '/debug/servers');
        const debugData = await debugResponse.json();
        console.log('Debug endpoint response:', debugData);
      } catch (debugError) {
        console.error('Debug endpoint failed:', debugError);
      }

      const servers = await api.get<Server[]>('/servers');
      console.log('API returned servers:', servers);
      return servers;
    } catch (error) {
      console.error('Error fetching servers from API:', error);
      // Fall back to mock data if the API fails
      console.log('Falling back to mock data');
      return [...mockServers];
    }
  }

  // Get a specific server
  async getServer(id: string): Promise<Server> {
    // Use mock data if in mock mode
    if (api.shouldUseMockData()) {
      const server = mockServers.find(s => s.id === id);
      if (!server) {
        throw new Error(`Server not found: ${id}`);
      }
      return Promise.resolve({ ...server });
    }

    // Call the real API
    try {
      const server = await api.get<Server>(`/servers/${id}`);
      return server;
    } catch (error) {
      console.error(`Error fetching server ${id}:`, error);

      // Fall back to mock data if the API fails
      const server = mockServers.find(s => s.id === id);
      if (!server) {
        throw new Error(`Server not found: ${id}`);
      }
      return { ...server };
    }
  }

  // Create a new server
  async createServer(params: ServerCreationParams): Promise<ServerProvisionResult> {
    // Use mock data if in mock mode
    if (api.shouldUseMockData()) {
      const newServer: Server = {
        id: `srv-${Math.floor(Math.random() * 1000)}`,
        name: params.name,
        host: `${params.name.toLowerCase().replace(/\s+/g, '-')}.example.com`,
        status: 'Provisioning',
        type: 'SFTP',
        storageUsed: 0,
        lastConnection: 'Never',
        region: params.region,
        username: params.username || 'sftp-user',
      };

      // Simulate provisioning (would happen on the backend)
      setTimeout(() => {
        newServer.status = 'Online';
      }, 3000);

      // Simulate adding to the list
      mockServers.push(newServer);

      return Promise.resolve({
        server: newServer,
        credentials: {
          host: newServer.host,
          port: 22,
          username: newServer.username || 'sftp-user',
          privateKey:
            params.securityOptions?.sshKeyType === 'generate'
              ? 'MOCK_PRIVATE_KEY_CONTENT'
              : undefined,
        },
      });
    }

    // Call the real API
    try {
      // Convert ServerCreationParams to a Record<string, unknown> to match API method signature
      const apiParams = params as unknown as Record<string, unknown>;
      const result = await api.post<ServerProvisionResult>('/servers', apiParams);
      return result;
    } catch (error) {
      console.error('Error creating server:', error);

      // Fall back to mock data if the API fails
      const newServer: Server = {
        id: `srv-${Math.floor(Math.random() * 1000)}`,
        name: params.name,
        host: `${params.name.toLowerCase().replace(/\s+/g, '-')}.example.com`,
        status: 'Provisioning',
        type: 'SFTP',
        storageUsed: 0,
        lastConnection: 'Never',
        region: params.region,
        username: params.username || 'sftp-user',
      };

      // Simulate adding to the list and provisioning
      mockServers.push(newServer);
      setTimeout(() => {
        newServer.status = 'Online';
      }, 3000);

      return {
        server: newServer,
        credentials: {
          host: newServer.host,
          port: 22,
          username: newServer.username || 'sftp-user',
          privateKey:
            params.securityOptions?.sshKeyType === 'generate'
              ? 'MOCK_PRIVATE_KEY_CONTENT'
              : undefined,
        },
      };
    }
  }

  // Delete a server
  async deleteServer(id: string): Promise<void> {
    // Use mock data if in mock mode
    if (api.shouldUseMockData()) {
      const index = mockServers.findIndex(s => s.id === id);
      if (index === -1) {
        throw new Error(`Server not found: ${id}`);
      }
      mockServers.splice(index, 1);
      return Promise.resolve();
    }

    // Call the real API
    try {
      await api.delete<void>(`/servers/${id}`);
    } catch (error) {
      console.error(`Error deleting server ${id}:`, error);

      // Fall back to mock behavior if the API fails
      const index = mockServers.findIndex(s => s.id === id);
      if (index === -1) {
        throw new Error(`Server not found: ${id}`);
      }
      mockServers.splice(index, 1);
    }
  }
}

// Export singleton instance
export const serverService = new ServerService();
