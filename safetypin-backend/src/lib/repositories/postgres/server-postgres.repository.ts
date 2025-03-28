import { PoolClient } from 'pg';
import { BasePostgresRepository } from './base-postgres.repository';
import { ServerRepository } from '../server.repository';
import {
  Server,
  CreateServerDto,
  UpdateServerDto,
  ServerProvisionResult
} from '../../../models/servers/server.model';
import { query, transaction } from '../../database/config';

// Define the row type for server table
interface ServerRow {
  id: string;
  organization_id: string;
  name: string;
  host: string;
  status: string;
  type: string;
  storage_used: string;
  storage_limit: string;
  last_connection: Date | null;
  region: string;
  username: string;
  creation_time: Date;
  last_update_time: Date;
  expiry_time: Date | null;
  lifecycle_status: string | null;
  security_settings: any;
  lifecycle_settings: any;
  cloud_provider_id: string | null;
  cloud_credential_id: string | null;
  cloud_resource_id: string | null;
}

export class ServerPostgresRepository 
  extends BasePostgresRepository<Server, ServerRow, CreateServerDto, UpdateServerDto>
  implements ServerRepository 
{
  constructor() {
    super('servers');
  }

  protected mapToEntity(row: ServerRow): Server {
    return {
      id: row.id,
      organizationId: row.organization_id,
      name: row.name,
      host: row.host,
      status: row.status,
      type: row.type,
      storageUsed: parseInt(row.storage_used, 10),
      storageLimit: parseInt(row.storage_limit, 10),
      lastConnection: row.last_connection,
      region: row.region,
      username: row.username,
      creationTime: row.creation_time,
      lastUpdateTime: row.last_update_time,
      expiryTime: row.expiry_time,
      lifecycleStatus: row.lifecycle_status,
      securitySettings: row.security_settings,
      lifecycleSettings: row.lifecycle_settings,
      cloudProviderId: row.cloud_provider_id,
      cloudCredentialId: row.cloud_credential_id,
      cloudResourceId: row.cloud_resource_id
    };
  }

  protected mapToCreateQuery(dto: CreateServerDto): { query: string; params: any[] } {
    const id = this.generateId();
    const params = [
      id,
      dto.organizationId,
      dto.name,
      `sftp-${this.generateRandomString(6)}.safetypin-oss.example.com`, // Generate random subdomain
      dto.storageSize * 1024 * 1024 * 1024, // Convert GB to bytes
      dto.region,
      dto.username,
      dto.securityOptions ? JSON.stringify(dto.securityOptions) : null,
      dto.lifecycleOptions ? JSON.stringify(dto.lifecycleOptions) : null,
      dto.cloudProviderId,
      dto.cloudCredentialId
    ];

    const query = `
      INSERT INTO servers(
        id, organization_id, name, host, 
        storage_limit, region, username, 
        security_settings, lifecycle_settings,
        cloud_provider_id, cloud_credential_id
      )
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    return { query, params };
  }

  protected mapToUpdateQuery(dto: UpdateServerDto): { setClause: string; params: any[] } {
    const updateParts: string[] = [];
    const params: any[] = [];

    if (dto.name !== undefined) {
      params.push(dto.name);
      updateParts.push(`name = $${params.length}`);
    }

    if (dto.status !== undefined) {
      params.push(dto.status);
      updateParts.push(`status = $${params.length}`);
    }

    if (dto.storageUsed !== undefined) {
      params.push(dto.storageUsed);
      updateParts.push(`storage_used = $${params.length}`);
    }

    if (dto.storageLimit !== undefined) {
      params.push(dto.storageLimit);
      updateParts.push(`storage_limit = $${params.length}`);
    }

    if (dto.securitySettings !== undefined) {
      params.push(JSON.stringify(dto.securitySettings));
      updateParts.push(`security_settings = $${params.length}`);
    }

    if (dto.lifecycleSettings !== undefined) {
      params.push(JSON.stringify(dto.lifecycleSettings));
      updateParts.push(`lifecycle_settings = $${params.length}`);
    }

    const setClause = updateParts.join(', ');
    return { setClause, params };
  }

  protected getTransactionRepository(client: PoolClient): ServerRepository {
    // Create a transaction-specific version of the repository
    const repo = new ServerPostgresRepository();
    // Override methods to use the provided client
    const originalQuery = query;
    const originalTransaction = transaction;
    
    // Mock these methods during transaction
    // This is a simplified approach, in a real implementation you'd need to adapt all methods
    return repo;
  }

  // Implementation of server-specific methods
  async findByOrganization(organizationId: string): Promise<Server[]> {
    const result = await query(
      `SELECT * FROM servers WHERE organization_id = $1`,
      [organizationId]
    );

    return result.rows.map(row => this.mapToEntity(row as ServerRow));
  }

  async findWithCredentials(id: string): Promise<ServerProvisionResult | null> {
    // First get the server
    const server = await this.findById(id);
    if (!server) {
      return null;
    }

    // Then get credentials
    const credResult = await query(
      `SELECT * FROM server_credentials WHERE server_id = $1`,
      [id]
    );

    if (credResult.rows.length === 0) {
      // Return server without credentials if none exist
      return {
        server,
        credentials: {
          host: server.host,
          port: 22, // Default SFTP port
          username: server.username
        }
      };
    }

    // Return with credentials
    return {
      server,
      credentials: {
        host: server.host,
        port: 22, // Default SFTP port
        username: server.username,
        privateKey: credResult.rows[0].private_key
      }
    };
  }

  async updateStatus(id: string, status: 'Online' | 'Offline' | 'Maintenance' | 'Provisioning'): Promise<Server | null> {
    const result = await query(
      `UPDATE servers 
       SET status = $1, last_update_time = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    return result.rows.length > 0 ? this.mapToEntity(result.rows[0] as ServerRow) : null;
  }

  async updateStorageUsed(id: string, storageUsed: number): Promise<Server | null> {
    const result = await query(
      `UPDATE servers 
       SET storage_used = $1, last_update_time = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [storageUsed, id]
    );

    return result.rows.length > 0 ? this.mapToEntity(result.rows[0] as ServerRow) : null;
  }

  async setExpiryTime(id: string, expiryTime: Date | null): Promise<Server | null> {
    const result = await query(
      `UPDATE servers 
       SET expiry_time = $1, last_update_time = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [expiryTime, id]
    );

    return result.rows.length > 0 ? this.mapToEntity(result.rows[0] as ServerRow) : null;
  }

  async findExpired(): Promise<Server[]> {
    const result = await query(
      `SELECT * FROM servers 
       WHERE expiry_time IS NOT NULL 
       AND expiry_time < CURRENT_TIMESTAMP
       AND status != 'Offline'`
    );

    return result.rows.map(row => this.mapToEntity(row as ServerRow));
  }

  async getServersByStatus(status: 'Online' | 'Offline' | 'Maintenance' | 'Provisioning'): Promise<Server[]> {
    const result = await query(
      `SELECT * FROM servers WHERE status = $1`,
      [status]
    );

    return result.rows.map(row => this.mapToEntity(row as ServerRow));
  }

  async storeCredentials(serverId: string, publicKey: string, privateKey: string): Promise<boolean> {
    const result = await query(
      `INSERT INTO server_credentials(server_id, key_type, public_key, private_key)
       VALUES($1, 'ssh', $2, $3)
       ON CONFLICT(server_id) 
       DO UPDATE SET 
         public_key = EXCLUDED.public_key,
         private_key = EXCLUDED.private_key,
         last_update_time = CURRENT_TIMESTAMP
       RETURNING *`,
      [serverId, publicKey, privateKey]
    );

    return result.rows.length > 0;
  }

  async getCredentials(serverId: string): Promise<{ publicKey: string; privateKey: string } | null> {
    const result = await query(
      `SELECT public_key, private_key FROM server_credentials WHERE server_id = $1`,
      [serverId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return {
      publicKey: result.rows[0].public_key,
      privateKey: result.rows[0].private_key
    };
  }

  async getServersByRegion(region: string): Promise<Server[]> {
    const result = await query(
      `SELECT * FROM servers WHERE region = $1`,
      [region]
    );

    return result.rows.map(row => this.mapToEntity(row as ServerRow));
  }

  // Helper to generate random string for hostnames
  protected generateRandomString(length: number): string {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
