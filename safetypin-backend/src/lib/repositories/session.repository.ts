import { BaseRepository } from './base.repository';
import { 
  Session,
  CreateSessionDto,
  UpdateSessionDto,
  RefreshToken,
  CreateRefreshTokenDto,
  RevokeRefreshTokenDto,
  MfaSession
} from '../../models/auth/session.model';

export interface SessionRepository extends BaseRepository<Session, CreateSessionDto, UpdateSessionDto> {
  // Find active sessions
  findActiveSessionsForUser(userId: string): Promise<Session[]>;
  findByDeviceId(deviceId: string): Promise<Session | null>;
  
  // Session management
  updateActivity(id: string): Promise<boolean>;
  extendSession(id: string, expirationTime: Date): Promise<Session | null>;
  markMfaComplete(id: string): Promise<Session | null>;
  
  // Session revocation
  revoke(id: string, reason?: string): Promise<boolean>;
  revokeAllForUser(userId: string, except?: string[]): Promise<number>;
  revokeExpiredSessions(): Promise<number>;
  
  // Session validation
  isValidSession(id: string): Promise<boolean>;
  
  // RefreshToken operations
  createRefreshToken(dto: CreateRefreshTokenDto): Promise<RefreshToken>;
  findRefreshTokenById(id: string): Promise<RefreshToken | null>;
  validateRefreshToken(token: string): Promise<RefreshToken | null>;
  revokeRefreshToken(dto: RevokeRefreshTokenDto): Promise<boolean>;
  revokeAllRefreshTokensForUser(userId: string): Promise<number>;
  cleanupExpiredRefreshTokens(): Promise<number>;
  
  // MFA Session operations
  createMfaSession(dto: any): Promise<MfaSession>;
  findMfaSessionById(id: string): Promise<MfaSession | null>;
  findMfaSessionBySessionId(sessionId: string): Promise<MfaSession | null>;
  updateMfaSession(id: string, dto: any): Promise<MfaSession | null>;
  completeMfaSession(id: string): Promise<MfaSession | null>;
  failMfaSession(id: string): Promise<MfaSession | null>;
  
  // Security metrics
  getActiveSessions(organizationId?: string): Promise<number>;
  getSessionsByDeviceType(): Promise<{ deviceType: string; count: number }[]>;
  getSessionsByLocation(): Promise<{ country: string; count: number }[]>;
}
