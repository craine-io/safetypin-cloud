import { BaseRepository } from './base.repository';
import { 
  Server, 
  CreateServerDto, 
  UpdateServerDto, 
  ServerProvisionResult 
} from '../../models/servers/server.model';

export interface ServerRepository extends BaseRepository<Server, CreateServerDto, UpdateServerDto> {
  // Find servers by organization
  findByOrganization(organizationId: string): Promise<Server[]>;
  
  // Find server with credentials
  findWithCredentials(id: string): Promise<ServerProvisionResult | null>;
  
  // Update server status
  updateStatus(id: string, status: 'Online' | 'Offline' | 'Maintenance' | 'Provisioning'): Promise<Server | null>;
  
  // Update storage usage
  updateStorageUsed(id: string, storageUsed: number): Promise<Server | null>;
  
  // Manage lifecycle
  setExpiryTime(id: string, expiryTime: Date | null): Promise<Server | null>;
  findExpired(): Promise<Server[]>;
  
  // Server status monitoring
  getServersByStatus(status: 'Online' | 'Offline' | 'Maintenance' | 'Provisioning'): Promise<Server[]>;
  
  // Credentials management
  storeCredentials(serverId: string, publicKey: string, privateKey: string): Promise<boolean>;
  getCredentials(serverId: string): Promise<{ publicKey: string; privateKey: string } | null>;
  
  // Advanced queries
  getServersByRegion(region: string): Promise<Server[]>;
}
