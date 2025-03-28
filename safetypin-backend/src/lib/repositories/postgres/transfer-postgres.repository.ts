import { PoolClient } from 'pg';
import { BasePostgresRepository } from './base-postgres.repository';
import { TransferRepository } from '../transfer.repository';
import {
  Transfer,
  CreateTransferDto,
  UpdateTransferDto,
  TransferStats
} from '../../../models/servers/transfers.model';
import { query, transaction } from '../../database/config';

// Define the row type for transfer table
interface TransferRow {
  id: string;
  server_id: string;
  organization_id: string;
  filename: string;
  path: string;
  direction: string;
  timestamp: Date;
  size: string;
  status: string;
  user_id: string;
  client_ip: string;
  transfer_time: number | null;
  checksum_before: string | null;
  checksum_after: string | null;
  error_details: string | null;
}

export class TransferPostgresRepository
  extends BasePostgresRepository<Transfer, TransferRow, CreateTransferDto, UpdateTransferDto>
  implements TransferRepository
{
  constructor() {
    super('transfers');
  }

  protected mapToEntity(row: TransferRow): Transfer {
    return {
      id: row.id,
      serverId: row.server_id,
      organizationId: row.organization_id,
      filename: row.filename,
      path: row.path,
      direction: row.direction,
      timestamp: row.timestamp,
      size: parseInt(row.size, 10),
      status: row.status,
      userId: row.user_id,
      clientIp: row.client_ip,
      transferTime: row.transfer_time,
      checksumBefore: row.checksum_before,
      checksumAfter: row.checksum_after,
      errorDetails: row.error_details
    };
  }

  protected mapToCreateQuery(dto: CreateTransferDto): { query: string; params: any[] } {
    const id = this.generateId();
    const params = [
      id,
      dto.serverId,
      dto.organizationId,
      dto.filename,
      dto.path,
      dto.direction,
      dto.size,
      dto.userId,
      dto.clientIp
    ];

    const query = `
      INSERT INTO transfers(
        id, server_id, organization_id, filename, path, 
        direction, size, user_id, client_ip
      )
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    return { query, params };
  }

  protected mapToUpdateQuery(dto: UpdateTransferDto): { setClause: string; params: any[] } {
    const updateParts: string[] = [];
    const params: any[] = [];

    if (dto.status !== undefined) {
      params.push(dto.status);
      updateParts.push(`status = $${params.length}`);
    }

    if (dto.transferTime !== undefined) {
      params.push(dto.transferTime);
      updateParts.push(`transfer_time = $${params.length}`);
    }

    if (dto.checksumAfter !== undefined) {
      params.push(dto.checksumAfter);
      updateParts.push(`checksum_after = $${params.length}`);
    }

    if (dto.errorDetails !== undefined) {
      params.push(dto.errorDetails);
      updateParts.push(`error_details = $${params.length}`);
    }

    const setClause = updateParts.join(', ');
    return { setClause, params };
  }

  protected getTransactionRepository(client: PoolClient): TransferRepository {
    // Create a transaction-specific version of the repository
    const repo = new TransferPostgresRepository();
    // Override methods to use the provided client
    // This is a simplified approach, in a real implementation you'd need to adapt all methods
    return repo;
  }

  // Implementation of transfer-specific methods
  async findByServer(serverId: string): Promise<Transfer[]> {
    const result = await query(
      `SELECT * FROM transfers WHERE server_id = $1 ORDER BY timestamp DESC`,
      [serverId]
    );

    return result.rows.map(row => this.mapToEntity(row as TransferRow));
  }

  async findByOrganization(organizationId: string): Promise<Transfer[]> {
    const result = await query(
      `SELECT * FROM transfers WHERE organization_id = $1 ORDER BY timestamp DESC`,
      [organizationId]
    );

    return result.rows.map(row => this.mapToEntity(row as TransferRow));
  }

  async findByUser(userId: string): Promise<Transfer[]> {
    const result = await query(
      `SELECT * FROM transfers WHERE user_id = $1 ORDER BY timestamp DESC`,
      [userId]
    );

    return result.rows.map(row => this.mapToEntity(row as TransferRow));
  }

  async findByPath(path: string, serverId?: string): Promise<Transfer[]> {
    let sql = `SELECT * FROM transfers WHERE path LIKE $1 OR filename LIKE $1`;
    const params: any[] = [`%${path}%`];

    if (serverId) {
      sql += ` AND server_id = $2`;
      params.push(serverId);
    }

    sql += ` ORDER BY timestamp DESC`;

    const result = await query(sql, params);
    return result.rows.map(row => this.mapToEntity(row as TransferRow));
  }

  async getTransferStats(serverId?: string, organizationId?: string): Promise<TransferStats> {
    // Build the WHERE clause based on parameters
    let whereClause = '';
    const params: any[] = [];

    if (serverId) {
      params.push(serverId);
      whereClause = `WHERE server_id = $${params.length}`;
    } else if (organizationId) {
      params.push(organizationId);
      whereClause = `WHERE organization_id = $${params.length}`;
    }

    // Query for total counts and sizes
    const result = await query(`
      SELECT 
        COUNT(*) as total_count,
        SUM(CASE WHEN direction = 'upload' THEN 1 ELSE 0 END) as upload_count,
        SUM(CASE WHEN direction = 'download' THEN 1 ELSE 0 END) as download_count,
        COALESCE(SUM(size), 0) as total_size_bytes,
        COALESCE(SUM(CASE WHEN direction = 'upload' THEN size ELSE 0 END), 0) as upload_size_bytes,
        COALESCE(SUM(CASE WHEN direction = 'download' THEN size ELSE 0 END), 0) as download_size_bytes
      FROM transfers
      ${whereClause}
    `, params);

    if (result.rows.length === 0) {
      return {
        totalCount: 0,
        uploadCount: 0,
        downloadCount: 0,
        totalSizeBytes: 0,
        uploadSizeBytes: 0,
        downloadSizeBytes: 0,
      };
    }

    const stats = result.rows[0];
    return {
      totalCount: parseInt(stats.total_count, 10),
      uploadCount: parseInt(stats.upload_count, 10),
      downloadCount: parseInt(stats.download_count, 10),
      totalSizeBytes: parseInt(stats.total_size_bytes, 10),
      uploadSizeBytes: parseInt(stats.upload_size_bytes, 10),
      downloadSizeBytes: parseInt(stats.download_size_bytes, 10),
    };
  }

  async getTransferStatsByPeriod(
    startDate: Date,
    endDate: Date,
    serverId?: string,
    organizationId?: string
  ): Promise<TransferStats> {
    // Build the WHERE clause based on parameters
    let whereClause = 'WHERE timestamp BETWEEN $1 AND $2';
    const params: any[] = [startDate, endDate];

    if (serverId) {
      params.push(serverId);
      whereClause += ` AND server_id = $${params.length}`;
    } else if (organizationId) {
      params.push(organizationId);
      whereClause += ` AND organization_id = $${params.length}`;
    }

    // Query for total counts and sizes
    const result = await query(`
      SELECT 
        COUNT(*) as total_count,
        SUM(CASE WHEN direction = 'upload' THEN 1 ELSE 0 END) as upload_count,
        SUM(CASE WHEN direction = 'download' THEN 1 ELSE 0 END) as download_count,
        COALESCE(SUM(size), 0) as total_size_bytes,
        COALESCE(SUM(CASE WHEN direction = 'upload' THEN size ELSE 0 END), 0) as upload_size_bytes,
        COALESCE(SUM(CASE WHEN direction = 'download' THEN size ELSE 0 END), 0) as download_size_bytes
      FROM transfers
      ${whereClause}
    `, params);

    if (result.rows.length === 0) {
      return {
        totalCount: 0,
        uploadCount: 0,
        downloadCount: 0,
        totalSizeBytes: 0,
        uploadSizeBytes: 0,
        downloadSizeBytes: 0,
      };
    }

    const stats = result.rows[0];
    return {
      totalCount: parseInt(stats.total_count, 10),
      uploadCount: parseInt(stats.upload_count, 10),
      downloadCount: parseInt(stats.download_count, 10),
      totalSizeBytes: parseInt(stats.total_size_bytes, 10),
      uploadSizeBytes: parseInt(stats.upload_size_bytes, 10),
      downloadSizeBytes: parseInt(stats.download_size_bytes, 10),
    };
  }

  async updateTransferStatus(id: string, status: 'completed' | 'failed' | 'in-progress', errorDetails?: string): Promise<Transfer | null> {
    let sql = `
      UPDATE transfers
      SET status = $1
    `;
    const params: any[] = [status];

    if (errorDetails) {
      sql += `, error_details = $2`;
      params.push(errorDetails);
    }

    if (status === 'completed') {
      sql += `, transfer_time = EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - timestamp))::INTEGER`;
    }

    sql += ` WHERE id = $${params.length + 1} RETURNING *`;
    params.push(id);

    const result = await query(sql, params);
    return result.rows.length > 0 ? this.mapToEntity(result.rows[0] as TransferRow) : null;
  }

  async findRecentTransfers(limit: number = 10, serverId?: string, organizationId?: string): Promise<Transfer[]> {
    let whereClause = '';
    const params: any[] = [];

    if (serverId) {
      params.push(serverId);
      whereClause = `WHERE server_id = $${params.length}`;
    } else if (organizationId) {
      params.push(organizationId);
      whereClause = `WHERE organization_id = $${params.length}`;
    }

    params.push(limit);
    const result = await query(`
      SELECT * FROM transfers
      ${whereClause}
      ORDER BY timestamp DESC
      LIMIT $${params.length}
    `, params);

    return result.rows.map(row => this.mapToEntity(row as TransferRow));
  }

  async getTransferCountByDirection(
    direction: 'upload' | 'download',
    serverId?: string,
    organizationId?: string
  ): Promise<number> {
    let whereClause = `WHERE direction = $1`;
    const params: any[] = [direction];

    if (serverId) {
      params.push(serverId);
      whereClause += ` AND server_id = $${params.length}`;
    } else if (organizationId) {
      params.push(organizationId);
      whereClause += ` AND organization_id = $${params.length}`;
    }

    const result = await query(`
      SELECT COUNT(*) as count
      FROM transfers
      ${whereClause}
    `, params);

    return parseInt(result.rows[0].count, 10);
  }
}
