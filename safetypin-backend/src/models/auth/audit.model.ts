// Audit models for HIPAA compliance

export interface AuthAuditLog {
  id: string;
  eventTime: Date;
  eventType: AuthEventType;
  userId: string | null;
  actingUserId: string | null;
  organizationId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  deviceId: string | null;
  result: EventResult;
  failureReason: string | null;
  resourceType: string | null;
  resourceId: string | null;
  additionalData: any | null;
}

export enum AuthEventType {
  // Authentication events
  LOGIN = 'login',
  LOGOUT = 'logout',
  FAILED_LOGIN = 'failed_login',
  PASSWORD_CHANGE = 'password_change',
  PASSWORD_RESET = 'password_reset',
  ACCOUNT_LOCKOUT = 'account_lockout',
  
  // MFA events
  MFA_ENABLED = 'mfa_enabled',
  MFA_DISABLED = 'mfa_disabled',
  MFA_METHOD_ADDED = 'mfa_method_added',
  MFA_METHOD_REMOVED = 'mfa_method_removed',
  MFA_CHALLENGE = 'mfa_challenge',
  MFA_SUCCESS = 'mfa_success',
  MFA_FAILURE = 'mfa_failure',
  
  // User management events
  USER_CREATED = 'user_created',
  USER_UPDATED = 'user_updated',
  USER_DELETED = 'user_deleted',
  USER_SUSPENDED = 'user_suspended',
  USER_ACTIVATED = 'user_activated',
  
  // Organization events
  ORGANIZATION_CREATED = 'organization_created',
  ORGANIZATION_UPDATED = 'organization_updated',
  ORGANIZATION_DELETED = 'organization_deleted',
  
  // Role and permission events
  ROLE_ASSIGNED = 'role_assigned',
  ROLE_REMOVED = 'role_removed',
  ROLE_CREATED = 'role_created',
  ROLE_UPDATED = 'role_updated',
  ROLE_DELETED = 'role_deleted',
  PERMISSION_ASSIGNED = 'permission_assigned',
  PERMISSION_REMOVED = 'permission_removed',
  
  // SSO events
  IDP_CREATED = 'idp_created',
  IDP_UPDATED = 'idp_updated',
  IDP_DELETED = 'idp_deleted',
  SSO_LOGIN = 'sso_login',
  SSO_FAILED = 'sso_failed',
  
  // SFTP server events
  SERVER_CREATED = 'server_created',
  SERVER_UPDATED = 'server_updated',
  SERVER_DELETED = 'server_deleted',
  SERVER_STARTED = 'server_started',
  SERVER_STOPPED = 'server_stopped',
  
  // Data access events
  FILE_UPLOADED = 'file_uploaded',
  FILE_DOWNLOADED = 'file_downloaded',
  FILE_DELETED = 'file_deleted',
  
  // Billing events
  SUBSCRIPTION_CHANGED = 'subscription_changed',
  PAYMENT_PROCESSED = 'payment_processed',
  PAYMENT_FAILED = 'payment_failed',
  
  // System events
  CONFIG_CHANGED = 'config_changed',
  API_ACCESS = 'api_access',
  
  // Generic event
  OTHER = 'other'
}

export enum EventResult {
  SUCCESS = 'success',
  FAILURE = 'failure',
  WARNING = 'warning',
  INFO = 'info'
}

export interface CreateAuditLogDto {
  eventType: AuthEventType;
  userId?: string;
  actingUserId?: string;
  organizationId?: string;
  ipAddress?: string;
  userAgent?: string;
  deviceId?: string;
  result: EventResult;
  failureReason?: string;
  resourceType?: string;
  resourceId?: string;
  additionalData?: any;
}

export interface SearchAuditLogsParams {
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  organizationId?: string;
  eventTypes?: AuthEventType[];
  result?: EventResult;
  ipAddress?: string;
  resourceType?: string;
  resourceId?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Access attempt logs for security monitoring
export interface AccessAttemptLog {
  id: string;
  userId: string | null;
  email: string | null;
  ipAddress: string;
  userAgent: string | null;
  attemptTime: Date;
  result: AccessAttemptResult;
  identityProviderId: string | null;
  additionalData: any | null;
}

export enum AccessAttemptResult {
  SUCCESS = 'success',
  INVALID_PASSWORD = 'invalid_password',
  USER_NOT_FOUND = 'user_not_found',
  ACCOUNT_LOCKED = 'account_locked',
  ACCOUNT_DISABLED = 'account_disabled',
  MFA_REQUIRED = 'mfa_required',
  MFA_FAILED = 'mfa_failed',
  SSO_FAILED = 'sso_failed',
  THROTTLED = 'throttled',
  OTHER_FAILURE = 'other_failure'
}

export interface CreateAccessAttemptLogDto {
  userId?: string;
  email?: string;
  ipAddress: string;
  userAgent?: string;
  result: AccessAttemptResult;
  identityProviderId?: string;
  additionalData?: any;
}

export interface SecurityAlert {
  id: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  message: string;
  userId?: string;
  organizationId?: string;
  ipAddress?: string;
  status: 'new' | 'investigating' | 'resolved' | 'dismissed';
  metadata: any;
}
