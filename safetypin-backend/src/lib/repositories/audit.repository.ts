import { BaseRepository, PaginatedResult } from './base.repository';
import { 
  AuthAuditLog,
  CreateAuditLogDto,
  SearchAuditLogsParams,
  AccessAttemptLog,
  CreateAccessAttemptLogDto,
  SecurityAlert
} from '../../models/auth/audit.model';

export interface AuditRepository {
  // Audit log creation
  createAuditLog(dto: CreateAuditLogDto): Promise<AuthAuditLog>;
  
  // Audit log retrieval
  findAuditLogById(id: string): Promise<AuthAuditLog | null>;
  searchAuditLogs(params: SearchAuditLogsParams): Promise<PaginatedResult<AuthAuditLog>>;
  getUserAuditLogs(userId: string, limit?: number, offset?: number): Promise<PaginatedResult<AuthAuditLog>>;
  getOrganizationAuditLogs(organizationId: string, limit?: number, offset?: number): Promise<PaginatedResult<AuthAuditLog>>;
  
  // Audit log aggregation and reporting
  getAuditLogCountByType(startDate?: Date, endDate?: Date, organizationId?: string): Promise<{ eventType: string; count: number }[]>;
  getAuditLogCountByResult(startDate?: Date, endDate?: Date, organizationId?: string): Promise<{ result: string; count: number }[]>;
  getAuditLogCountByUser(startDate?: Date, endDate?: Date, organizationId?: string, limit?: number): Promise<{ userId: string; count: number }[]>;
  
  // Access attempt tracking
  createAccessAttemptLog(dto: CreateAccessAttemptLogDto): Promise<AccessAttemptLog>;
  getRecentAccessAttempts(userId: string, limit?: number): Promise<AccessAttemptLog[]>;
  getFailedAccessAttempts(userId: string, minutes?: number): Promise<AccessAttemptLog[]>;
  getFailedAccessAttemptsByIp(ipAddress: string, minutes?: number): Promise<AccessAttemptLog[]>;
  
  // Security monitoring
  createSecurityAlert(alert: Partial<SecurityAlert>): Promise<SecurityAlert>;
  getActiveSecurityAlerts(organizationId?: string): Promise<SecurityAlert[]>;
  updateSecurityAlertStatus(id: string, status: string): Promise<SecurityAlert | null>;
  
  // Data retention and compliance
  archiveAuditLogs(olderThan: Date): Promise<number>;
  deleteArchivedAuditLogs(olderThan: Date): Promise<number>;
  exportAuditLogs(params: SearchAuditLogsParams, format: 'csv' | 'json'): Promise<string>;
  
  // HIPAA specific tracking
  getHipaaComplianceReport(organizationId: string, startDate: Date, endDate: Date): Promise<any>;
}
