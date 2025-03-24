// Session model for tracking user authentication sessions

export interface Session {
  id: string;
  userId: string;
  creationTime: Date;
  expirationTime: Date;
  lastActivityTime: Date;
  ipAddress: string | null;
  userAgent: string | null;
  deviceId: string | null;
  refreshTokenId: string | null;
  isMfaComplete: boolean;
  revoked: boolean;
  revocationReason: string | null;
  sessionData: SessionData | null;
}

export interface SessionData {
  // Custom session data
  deviceInfo?: {
    os?: string;
    browser?: string;
    browserVersion?: string;
    isMobile?: boolean;
  };
  requestLocation?: {
    country?: string;
    region?: string;
    city?: string;
  };
  authMethod?: string; // 'password', 'sso', 'token', etc.
  originalIp?: string; // If behind a proxy
  
  // Additional session metadata
  [key: string]: any;
}

export interface CreateSessionDto {
  userId: string;
  expirationTime: Date;
  ipAddress?: string;
  userAgent?: string;
  deviceId?: string;
  refreshTokenId?: string;
  isMfaComplete?: boolean;
  sessionData?: SessionData;
}

export interface UpdateSessionDto {
  lastActivityTime?: Date;
  expirationTime?: Date;
  isMfaComplete?: boolean;
  revoked?: boolean;
  revocationReason?: string;
  sessionData?: SessionData;
}

// Refresh token for implementing OAuth2 refresh token functionality
export interface RefreshToken {
  id: string;
  userId: string;
  tokenHash: string;
  creationTime: Date;
  expirationTime: Date;
  usedTime: Date | null;
  isUsed: boolean;
  isRevoked: boolean;
  clientId: string | null;
  scope: string | null;
}

export interface CreateRefreshTokenDto {
  userId: string;
  token: string; // Plain token to be hashed
  expirationTime: Date;
  clientId?: string;
  scope?: string;
}

export interface RevokeRefreshTokenDto {
  tokenId: string;
  reason?: string;
}

// MFA session for managing multi-factor authentication state
export interface MfaSession {
  id: string;
  userId: string;
  sessionId: string;
  methodId: string | null;
  status: MfaSessionStatus;
  creationTime: Date;
  expirationTime: Date;
  verificationTime: Date | null;
  challengeId: string | null;
  attemptCount: number;
}

export enum MfaSessionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface CreateMfaSessionDto {
  userId: string;
  sessionId: string;
  methodId?: string;
  expirationTime: Date;
  challengeId?: string;
}

export interface UpdateMfaSessionDto {
  status?: MfaSessionStatus;
  verificationTime?: Date;
  attemptCount?: number;
}
