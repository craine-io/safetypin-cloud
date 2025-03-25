import { PoolClient } from 'pg';
import { AuditRepository } from '../audit.repository';
import { 
  AuthAuditLog,
  CreateAuditLogDto,
  SearchAuditLogsParams,
  AccessAttemptLog,
  CreateAccessAttemptLogDto,
  SecurityAlert,
  AuthEventType,
  EventResult,
  AccessAttemptResult
} from '../../../models/auth/audit.model';
import { PaginatedResult, getPaginatedResult } from '../base.repository';
import { query, transaction } from '../../database/config';
import { v4 as uuidv4 } from 'uuid';

export class AuditPostgresRepository implements AuditRepository {
  // Helper to generate UUIDs
  protected generateId(): string {
    return uuidv4();
  }
  
  // Helper to map database row to AuthAuditLog
  private mapToAuditLog(row: any): AuthAuditLog {
    return {
      id: row.id,
      eventTime: row.event_time,
      eventType: row.event_type as AuthEventType,
      userId: row.user_id,
      actingUserId: row.acting_user_id,
      organizationId: row.organization_id,
      ipAddress: row.ip_address,
      userAgent: row.user_agent,
      deviceId: row.device_id,
      result: row.result as EventResult,
      failureReason: row.failure_reason,
      resourceType: row.resource_type,
      resourceId: row.resource_id,
      additionalData: row.additional_data ? JSON.parse(row.additional_data) : null
    };
  }
  
  // Helper to map database row to AccessAttemptLog
  private mapToAccessAttemptLog(row: any): AccessAttemptLog {
    return {
      id: row.id,
      userId: row.user_id,
      email: row.email,
      ipAddress: row.ip_address,
      userAgent: row.user_agent,
      attemptTime: row.attempt_time,
      result: row.result as AccessAttemptResult,
      identityProviderId: row.identity_provider_id,
      additionalData: row.additional_data ? JSON.parse(row.additional_data) : null
    };
  }
  
  // Helper to map database row to SecurityAlert
  private mapToSecurityAlert(row: any): SecurityAlert {
    return {
      id: row.id,
      timestamp: row.timestamp,
      severity: row.severity,
      type: row.type,
      message: row.message,
      userId: row.user_id,
      organizationId: row.organization_id,
      ipAddress: row.ip_address,
      status: row.status,
      metadata: row.metadata ? JSON.parse(row.metadata) : {}
    };
  }
  
  // Audit log creation
  async createAuditLog(dto: CreateAuditLogDto): Promise<AuthAuditLog> {
    const id = this.generateId();
    const params = [
      id,
      dto.eventType,
      dto.userId || null,
      dto.actingUserId || null,
      dto.organizationId || null,
      dto.ipAddress || null,
      dto.userAgent || null,
      dto.deviceId || null,
      dto.result,
      dto.failureReason || null,
      dto.resourceType || null,
      dto.resourceId || null,
      dto.additionalData ? JSON.stringify(dto.additionalData) : null
    ];
    
    const result = await query(
      `INSERT INTO auth_audit_logs (
        id, event_type, user_id, acting_user_id, organization_id,
        ip_address, user_agent, device_id, result, failure_reason,
        resource_type, resource_id, additional_data
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      params
    );
    
    return this.mapToAuditLog(result.rows[0]);
  }
  
  // Audit log retrieval
  async findAuditLogById(id: string): Promise<AuthAuditLog | null> {
    const result = await query(
      `SELECT * FROM auth_audit_logs WHERE id = $1`,
      [id]
    );
    
    return result.rows.length > 0 ? this.mapToAuditLog(result.rows[0]) : null;
  }
  
  async searchAuditLogs(params: SearchAuditLogsParams): Promise<PaginatedResult<AuthAuditLog>> {
    const conditions: string[] = [];
    const queryParams: any[] = [];
    
    if (params.startDate) {
      queryParams.push(params.startDate);
      conditions.push(`event_time >= $${queryParams.length}`);
    }
    
    if (params.endDate) {
      queryParams.push(params.endDate);
      conditions.push(`event_time <= $${queryParams.length}`);
    }
    
    if (params.userId) {
      queryParams.push(params.userId);
      conditions.push(`user_id = $${queryParams.length}`);
    }
    
    if (params.organizationId) {
      queryParams.push(params.organizationId);
      conditions.push(`organization_id = $${queryParams.length}`);
    }
    
    if (params.eventTypes && params.eventTypes.length > 0) {
      queryParams.push(params.eventTypes);
      conditions.push(`event_type = ANY($${queryParams.length})`);
    }
    
    if (params.result) {
      queryParams.push(params.result);
      conditions.push(`result = $${queryParams.length}`);
    }
    
    if (params.ipAddress) {
      queryParams.push(params.ipAddress);
      conditions.push(`ip_address = $${queryParams.length}`);
    }
    
    if (params.resourceType) {
      queryParams.push(params.resourceType);
      conditions.push(`resource_type = $${queryParams.length}`);
    }
    
    if (params.resourceId) {
      queryParams.push(params.resourceId);
      conditions.push(`resource_id = $${queryParams.length}`);
    }
    
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    const sortBy = params.sortBy || 'event_time';
    const sortDirection = params.sortDirection || 'desc';
    const limit = params.limit || 20;
    const offset = params.offset || 0;
    
    // Count total records
    const countResult = await query(
      `SELECT COUNT(*) as total FROM auth_audit_logs ${whereClause}`,
      queryParams
    );
    
    const total = parseInt(countResult.rows[0].total, 10);
    
    // Get paginated results
    const result = await query(
      `SELECT * FROM auth_audit_logs
       ${whereClause}
       ORDER BY ${sortBy} ${sortDirection}
       LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`,
      [...queryParams, limit, offset]
    );
    
    const items = result.rows.map(row => this.mapToAuditLog(row));
    
    return getPaginatedResult(items, total, limit, offset);
  }
  
  async getUserAuditLogs(userId: string, limit = 20, offset = 0): Promise<PaginatedResult<AuthAuditLog>> {
    return this.searchAuditLogs({
      userId,
      limit,
      offset,
      sortBy: 'event_time',
      sortDirection: 'desc'
    });
  }
  
  async getOrganizationAuditLogs(organizationId: string, limit = 20, offset = 0): Promise<PaginatedResult<AuthAuditLog>> {
    return this.searchAuditLogs({
      organizationId,
      limit,
      offset,
      sortBy: 'event_time',
      sortDirection: 'desc'
    });
  }
  
  // Audit log aggregation and reporting
  async getAuditLogCountByType(startDate?: Date, endDate?: Date, organizationId?: string): Promise<{ eventType: string; count: number }[]> {
    const conditions: string[] = [];
    const params: any[] = [];
    
    if (startDate) {
      params.push(startDate);
      conditions.push(`event_time >= $${params.length}`);
    }
    
    if (endDate) {
      params.push(endDate);
      conditions.push(`event_time <= $${params.length}`);
    }
    
    if (organizationId) {
      params.push(organizationId);
      conditions.push(`organization_id = $${params.length}`);
    }
    
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    const result = await query(
      `SELECT event_type, COUNT(*) as count
       FROM auth_audit_logs
       ${whereClause}
       GROUP BY event_type
       ORDER BY count DESC`,
      params
    );
    
    return result.rows.map(row => ({
      eventType: row.event_type,
      count: parseInt(row.count, 10)
    }));
  }
  
  async getAuditLogCountByResult(startDate?: Date, endDate?: Date, organizationId?: string): Promise<{ result: string; count: number }[]> {
    const conditions: string[] = [];
    const params: any[] = [];
    
    if (startDate) {
      params.push(startDate);
      conditions.push(`event_time >= $${params.length}`);
    }
    
    if (endDate) {
      params.push(endDate);
      conditions.push(`event_time <= $${params.length}`);
    }
    
    if (organizationId) {
      params.push(organizationId);
      conditions.push(`organization_id = $${params.length}`);
    }
    
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    const result = await query(
      `SELECT result, COUNT(*) as count
       FROM auth_audit_logs
       ${whereClause}
       GROUP BY result
       ORDER BY count DESC`,
      params
    );
    
    return result.rows.map(row => ({
      result: row.result,
      count: parseInt(row.count, 10)
    }));
  }
  
  async getAuditLogCountByUser(startDate?: Date, endDate?: Date, organizationId?: string, limit = 10): Promise<{ userId: string; count: number }[]> {
    const conditions: string[] = [];
    const params: any[] = [];
    
    if (startDate) {
      params.push(startDate);
      conditions.push(`event_time >= $${params.length}`);
    }
    
    if (endDate) {
      params.push(endDate);
      conditions.push(`event_time <= $${params.length}`);
    }
    
    if (organizationId) {
      params.push(organizationId);
      conditions.push(`organization_id = $${params.length}`);
    }
    
    conditions.push('user_id IS NOT NULL');
    
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    params.push(limit);
    
    const result = await query(
      `SELECT user_id, COUNT(*) as count
       FROM auth_audit_logs
       ${whereClause}
       GROUP BY user_id
       ORDER BY count DESC
       LIMIT $${params.length}`,
      params
    );
    
    return result.rows.map(row => ({
      userId: row.user_id,
      count: parseInt(row.count, 10)
    }));
  }
  
  // Access attempt tracking
  async createAccessAttemptLog(dto: CreateAccessAttemptLogDto): Promise<AccessAttemptLog> {
    const id = this.generateId();
    const params = [
      id,
      dto.userId || null,
      dto.email || null,
      dto.ipAddress,
      dto.userAgent || null,
      dto.result,
      dto.identityProviderId || null,
      dto.additionalData ? JSON.stringify(dto.additionalData) : null
    ];
    
    const result = await query(
      `INSERT INTO access_attempt_logs (
        id, user_id, email, ip_address, user_agent, 
        result, identity_provider_id, additional_data
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      params
    );
    
    return this.mapToAccessAttemptLog(result.rows[0]);
  }
  
  async getRecentAccessAttempts(userId: string, limit = 10): Promise<AccessAttemptLog[]> {
    const result = await query(
      `SELECT * FROM access_attempt_logs
       WHERE user_id = $1
       ORDER BY attempt_time DESC
       LIMIT $2`,
      [userId, limit]
    );
    
    return result.rows.map(row => this.mapToAccessAttemptLog(row));
  }
  
  async getFailedAccessAttempts(userId: string, minutes = 30): Promise<AccessAttemptLog[]> {
    const result = await query(
      `SELECT * FROM access_attempt_logs
       WHERE user_id = $1
       AND result != 'success'
       AND attempt_time > (CURRENT_TIMESTAMP - INTERVAL '1 minute' * $2)
       ORDER BY attempt_time DESC`,
      [userId, minutes]
    );
    
    return result.rows.map(row => this.mapToAccessAttemptLog(row));
  }
  
  async getFailedAccessAttemptsByIp(ipAddress: string, minutes = 30): Promise<AccessAttemptLog[]> {
    const result = await query(
      `SELECT * FROM access_attempt_logs
       WHERE ip_address = $1
       AND result != 'success'
       AND attempt_time > (CURRENT_TIMESTAMP - INTERVAL '1 minute' * $2)
       ORDER BY attempt_time DESC`,
      [ipAddress, minutes]
    );
    
    return result.rows.map(row => this.mapToAccessAttemptLog(row));
  }
  
  // Security monitoring
  async createSecurityAlert(alert: Partial<SecurityAlert>): Promise<SecurityAlert> {
    const id = this.generateId();
    const params = [
      id,
      alert.severity || 'medium',
      alert.type || 'generic_alert',
      alert.message,
      alert.userId || null,
      alert.organizationId || null,
      alert.ipAddress || null,
      alert.status || 'new',
      alert.metadata ? JSON.stringify(alert.metadata) : '{}'
    ];
    
    const result = await query(
      `INSERT INTO security_alerts (
        id, severity, type, message, user_id, 
        organization_id, ip_address, status, metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      params
    );
    
    return this.mapToSecurityAlert(result.rows[0]);
  }
  
  async getActiveSecurityAlerts(organizationId?: string): Promise<SecurityAlert[]> {
    let sql = `
      SELECT * FROM security_alerts
      WHERE status IN ('new', 'investigating')
    `;
    const params: any[] = [];
    
    if (organizationId) {
      params.push(organizationId);
      sql += ` AND organization_id = $1`;
    }
    
    sql += ` ORDER BY timestamp DESC`;
    
    const result = await query(sql, params);
    
    return result.rows.map(row => this.mapToSecurityAlert(row));
  }
  
  async updateSecurityAlertStatus(id: string, status: string): Promise<SecurityAlert | null> {
    const result = await query(
      `UPDATE security_alerts
       SET status = $2
       WHERE id = $1
       RETURNING *`,
      [id, status]
    );
    
    return result.rows.length > 0 ? this.mapToSecurityAlert(result.rows[0]) : null;
  }
  
  // Data retention and compliance
  async archiveAuditLogs(olderThan: Date): Promise<number> {
    // In a real implementation, this would archive logs to a separate table or storage
    const result = await query(
      `UPDATE auth_audit_logs
       SET archived = true
       WHERE event_time < $1
       AND archived = false`,
      [olderThan]
    );
    
    return result.rowCount;
  }
  
  async deleteArchivedAuditLogs(olderThan: Date): Promise<number> {
    const result = await query(
      `DELETE FROM auth_audit_logs
       WHERE event_time < $1
       AND archived = true`,
      [olderThan]
    );
    
    return result.rowCount;
  }
  
  async exportAuditLogs(params: SearchAuditLogsParams, format: 'csv' | 'json'): Promise<string> {
    // In a real implementation, this would generate and return a file
    // For now, we'll just return a placeholder message
    const { items } = await this.searchAuditLogs(params);
    
    if (format === 'json') {
      return JSON.stringify(items, null, 2);
    } else {
      // CSV format - simple implementation
      const headers = 'id,eventTime,eventType,userId,actingUserId,result\n';
      const rows = items.map(log => 
        `${log.id},${log.eventTime},${log.eventType},${log.userId || ''},${log.actingUserId || ''},${log.result}`
      ).join('\n');
      
      return headers + rows;
    }
  }
  
  // HIPAA specific tracking
  async getHipaaComplianceReport(organizationId: string, startDate: Date, endDate: Date): Promise<any> {
    // In a real implementation, this would generate a comprehensive HIPAA compliance report
    // For now, we'll return a basic structure with counts
    
    const loginEvents = await query(
      `SELECT COUNT(*) as count 
       FROM auth_audit_logs 
       WHERE organization_id = $1 
       AND event_time BETWEEN $2 AND $3 
       AND event_type = 'login'`,
      [organizationId, startDate, endDate]
    );
    
    const failedLoginEvents = await query(
      `SELECT COUNT(*) as count 
       FROM auth_audit_logs 
       WHERE organization_id = $1 
       AND event_time BETWEEN $2 AND $3 
       AND event_type = 'failed_login'`,
      [organizationId, startDate, endDate]
    );
    
    const fileAccessEvents = await query(
      `SELECT COUNT(*) as count 
       FROM auth_audit_logs 
       WHERE organization_id = $1 
       AND event_time BETWEEN $2 AND $3 
       AND (event_type = 'file_uploaded' OR event_type = 'file_downloaded' OR event_type = 'file_deleted')`,
      [organizationId, startDate, endDate]
    );
    
    return {
      reportGeneratedAt: new Date(),
      organizationId,
      period: {
        startDate,
        endDate
      },
      summary: {
        totalEvents: parseInt(loginEvents.rows[0].count, 10) + 
                     parseInt(failedLoginEvents.rows[0].count, 10) + 
                     parseInt(fileAccessEvents.rows[0].count, 10),
        successfulLogins: parseInt(loginEvents.rows[0].count, 10),
        failedLogins: parseInt(failedLoginEvents.rows[0].count, 10),
        fileAccessEvents: parseInt(fileAccessEvents.rows[0].count, 10)
      },
      // Additional sections would be included in a real implementation
      isCompliant: true // Placeholder for actual compliance check
    };
  }
}
