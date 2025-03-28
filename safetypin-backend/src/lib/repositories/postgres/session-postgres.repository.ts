import { PoolClient } from 'pg';
import * as bcrypt from 'bcryptjs';
import { BasePostgresRepository } from './base-postgres.repository';
import { SessionRepository } from '../session.repository';
import { 
  Session,
  CreateSessionDto,
  UpdateSessionDto,
  RefreshToken,
  CreateRefreshTokenDto,
  RevokeRefreshTokenDto,
  MfaSession,
  MfaSessionStatus,
  CreateMfaSessionDto,
  UpdateMfaSessionDto
} from '../../../models/auth/session.model';
import { query, transaction } from '../../database/config';

// Define the row type for session table
interface SessionRow {
  id: string;
  user_id: string;
  creation_time: Date;
  expiration_time: Date;
  last_activity_time: Date;
  ip_address: string | null;
  user_agent: string | null;
  device_id: string | null;
  refresh_token_id: string | null;
  is_mfa_complete: boolean;
  revoked: boolean;
  revocation_reason: string | null;
  session_data: string | null;
}

export class SessionPostgresRepository 
  extends BasePostgresRepository<Session, SessionRow, CreateSessionDto, UpdateSessionDto> 
  implements SessionRepository 
{
  constructor() {
    super('sessions');
  }
  
  protected mapToEntity(row: SessionRow): Session {
    return {
      id: row.id,
      userId: row.user_id,
      creationTime: row.creation_time,
      expirationTime: row.expiration_time,
      lastActivityTime: row.last_activity_time,
      ipAddress: row.ip_address,
      userAgent: row.user_agent,
      deviceId: row.device_id,
      refreshTokenId: row.refresh_token_id,
      isMfaComplete: row.is_mfa_complete,
      revoked: row.revoked,
      revocationReason: row.revocation_reason,
      sessionData: row.session_data ? JSON.parse(row.session_data) : null
    };
  }
  
  protected mapToCreateQuery(dto: CreateSessionDto): { query: string; params: any[] } {
    const id = this.generateId();
    const params = [
      id,
      dto.userId,
      dto.expirationTime,
      dto.ipAddress || null,
      dto.userAgent || null,
      dto.deviceId || null,
      dto.refreshTokenId || null,
      dto.isMfaComplete !== undefined ? dto.isMfaComplete : false,
      dto.sessionData ? JSON.stringify(dto.sessionData) : null
    ];
    
    const query = `
      INSERT INTO sessions (
        id, user_id, expiration_time, ip_address, user_agent, 
        device_id, refresh_token_id, is_mfa_complete, session_data
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    return { query, params };
  }
  
  protected mapToUpdateQuery(dto: UpdateSessionDto): { setClause: string; params: any[] } {
    const updates: string[] = [];
    const params: any[] = [];
    
    if (dto.lastActivityTime !== undefined) {
      params.push(dto.lastActivityTime);
      updates.push(`last_activity_time = $${params.length}`);
    }
    
    if (dto.expirationTime !== undefined) {
      params.push(dto.expirationTime);
      updates.push(`expiration_time = $${params.length}`);
    }
    
    if (dto.isMfaComplete !== undefined) {
      params.push(dto.isMfaComplete);
      updates.push(`is_mfa_complete = $${params.length}`);
    }
    
    if (dto.revoked !== undefined) {
      params.push(dto.revoked);
      updates.push(`revoked = $${params.length}`);
    }
    
    if (dto.revocationReason !== undefined) {
      params.push(dto.revocationReason);
      updates.push(`revocation_reason = $${params.length}`);
    }
    
    if (dto.sessionData !== undefined) {
      params.push(dto.sessionData ? JSON.stringify(dto.sessionData) : null);
      updates.push(`session_data = $${params.length}`);
    }
    
    const setClause = updates.join(', ');
    
    return { setClause, params };
  }
  
  protected getTransactionRepository(client: PoolClient): SessionRepository {
    // Create a transaction-specific repository that uses the client
    const transactionRepo = new SessionPostgresRepository();
    
    // Override methods to use the provided client
    const originalQuery = transactionRepo.findById;
    transactionRepo.findById = async (id: string) => {
      const result = await client.query(
        `SELECT * FROM ${this.tableName} WHERE ${this.idField} = $1`,
        [id]
      );
      
      return result.rows.length > 0 ? this.mapToEntity(result.rows[0] as SessionRow) : null;
    };
    
    // Override other methods similarly as needed for transactions
    
    return transactionRepo;
  }
  
  // Session repository specific methods
  async findActiveSessionsForUser(userId: string): Promise<Session[]> {
    const result = await query(
      `SELECT * FROM sessions 
       WHERE user_id = $1 
       AND revoked = false 
       AND expiration_time > CURRENT_TIMESTAMP
       ORDER BY creation_time DESC`,
      [userId]
    );
    
    return result.rows.map(row => this.mapToEntity(row as SessionRow));
  }
  
  async findByDeviceId(deviceId: string): Promise<Session | null> {
    const result = await query(
      `SELECT * FROM sessions 
       WHERE device_id = $1 
       AND revoked = false 
       AND expiration_time > CURRENT_TIMESTAMP
       ORDER BY creation_time DESC
       LIMIT 1`,
      [deviceId]
    );
    
    return result.rows.length > 0 ? this.mapToEntity(result.rows[0] as SessionRow) : null;
  }
  
  async updateActivity(id: string): Promise<boolean> {
    const result = await query(
      `UPDATE sessions 
       SET last_activity_time = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [id]
    );
    
    return result.rowCount > 0;
  }
  
  async extendSession(id: string, expirationTime: Date): Promise<Session | null> {
    const result = await query(
      `UPDATE sessions 
       SET expiration_time = $2,
           last_activity_time = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id, expirationTime]
    );
    
    return result.rows.length > 0 ? this.mapToEntity(result.rows[0] as SessionRow) : null;
  }
  
  async markMfaComplete(id: string): Promise<Session | null> {
    const result = await query(
      `UPDATE sessions 
       SET is_mfa_complete = true,
           last_activity_time = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id]
    );
    
    return result.rows.length > 0 ? this.mapToEntity(result.rows[0] as SessionRow) : null;
  }
  
  async revoke(id: string, reason?: string): Promise<boolean> {
    const result = await query(
      `UPDATE sessions 
       SET revoked = true,
           revocation_reason = $2,
           last_activity_time = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [id, reason || 'User logged out']
    );
    
    return result.rowCount > 0;
  }
  
  async revokeAllForUser(userId: string, except: string[] = []): Promise<number> {
    let queryParams = [userId];
    let exceptClause = '';
    
    if (except.length > 0) {
      exceptClause = ` AND id NOT IN (${except.map((_, i) => `$${i + 2}`).join(', ')})`;
      queryParams = [...queryParams, ...except];
    }
    
    const result = await query(
      `UPDATE sessions 
       SET revoked = true,
           revocation_reason = 'User logged out from all devices',
           last_activity_time = CURRENT_TIMESTAMP
       WHERE user_id = $1
       AND revoked = false${exceptClause}`,
      queryParams
    );
    
    return result.rowCount;
  }
  
  async revokeExpiredSessions(): Promise<number> {
    const result = await query(
      `UPDATE sessions 
       SET revoked = true,
           revocation_reason = 'Session expired'
       WHERE expiration_time < CURRENT_TIMESTAMP
       AND revoked = false`,
      []
    );
    
    return result.rowCount;
  }
  
  async isValidSession(id: string): Promise<boolean> {
    const result = await query(
      `SELECT 1 FROM sessions 
       WHERE id = $1 
       AND revoked = false 
       AND expiration_time > CURRENT_TIMESTAMP`,
      [id]
    );
    
    return result.rows.length > 0;
  }
  
  // Refresh Token methods
  async createRefreshToken(dto: CreateRefreshTokenDto): Promise<RefreshToken> {
    const id = this.generateId();
    // Hash the token for security
    const tokenHash = await bcrypt.hash(dto.token, 10);
    
    const result = await query(
      `INSERT INTO refresh_tokens (
        id, user_id, token_hash, expiration_time, client_id, scope
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        id,
        dto.userId,
        tokenHash,
        dto.expirationTime,
        dto.clientId || null,
        dto.scope || null
      ]
    );
    
    return {
      id: result.rows[0].id,
      userId: result.rows[0].user_id,
      tokenHash: result.rows[0].token_hash,
      creationTime: result.rows[0].creation_time,
      expirationTime: result.rows[0].expiration_time,
      usedTime: result.rows[0].used_time,
      isUsed: result.rows[0].is_used,
      isRevoked: result.rows[0].is_revoked,
      clientId: result.rows[0].client_id,
      scope: result.rows[0].scope
    };
  }
  
  async findRefreshTokenById(id: string): Promise<RefreshToken | null> {
    const result = await query(
      `SELECT * FROM refresh_tokens WHERE id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return {
      id: result.rows[0].id,
      userId: result.rows[0].user_id,
      tokenHash: result.rows[0].token_hash,
      creationTime: result.rows[0].creation_time,
      expirationTime: result.rows[0].expiration_time,
      usedTime: result.rows[0].used_time,
      isUsed: result.rows[0].is_used,
      isRevoked: result.rows[0].is_revoked,
      clientId: result.rows[0].client_id,
      scope: result.rows[0].scope
    };
  }
  
  async validateRefreshToken(token: string): Promise<RefreshToken | null> {
    // This operation needs to be done carefully for security reasons
    // We'll get all non-revoked tokens and check them one by one
    const result = await query(
      `SELECT * FROM refresh_tokens 
       WHERE is_revoked = false 
       AND is_used = false
       AND expiration_time > CURRENT_TIMESTAMP`,
      []
    );
    
    // Compare the token with each hash
    for (const row of result.rows) {
      const isValid = await bcrypt.compare(token, row.token_hash);
      
      if (isValid) {
        // Mark the token as used
        await query(
          `UPDATE refresh_tokens 
           SET is_used = true, 
               used_time = CURRENT_TIMESTAMP 
           WHERE id = $1`,
          [row.id]
        );
        
        return {
          id: row.id,
          userId: row.user_id,
          tokenHash: row.token_hash,
          creationTime: row.creation_time,
          expirationTime: row.expiration_time,
          usedTime: new Date(),
          isUsed: true,
          isRevoked: row.is_revoked,
          clientId: row.client_id,
          scope: row.scope
        };
      }
    }
    
    return null;
  }
  
  async revokeRefreshToken(dto: RevokeRefreshTokenDto): Promise<boolean> {
    const result = await query(
      `UPDATE refresh_tokens 
       SET is_revoked = true
       WHERE id = $1`,
      [dto.tokenId]
    );
    
    return result.rowCount > 0;
  }
  
  async revokeAllRefreshTokensForUser(userId: string): Promise<number> {
    const result = await query(
      `UPDATE refresh_tokens 
       SET is_revoked = true
       WHERE user_id = $1
       AND is_revoked = false`,
      [userId]
    );
    
    return result.rowCount;
  }
  
  async cleanupExpiredRefreshTokens(): Promise<number> {
    const result = await query(
      `DELETE FROM refresh_tokens 
       WHERE expiration_time < CURRENT_TIMESTAMP
       OR (is_used = true AND used_time < CURRENT_TIMESTAMP - INTERVAL '30 days')`,
      []
    );
    
    return result.rowCount;
  }
  
  // MFA Session methods
  async createMfaSession(dto: CreateMfaSessionDto): Promise<MfaSession> {
    const id = this.generateId();
    
    const result = await query(
      `INSERT INTO mfa_sessions (
        id, user_id, session_id, method_id, status, expiration_time, challenge_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        id,
        dto.userId,
        dto.sessionId,
        dto.methodId || null,
        MfaSessionStatus.PENDING,
        dto.expirationTime,
        dto.challengeId || null
      ]
    );
    
    return {
      id: result.rows[0].id,
      userId: result.rows[0].user_id,
      sessionId: result.rows[0].session_id,
      methodId: result.rows[0].method_id,
      status: result.rows[0].status as MfaSessionStatus,
      creationTime: result.rows[0].creation_time,
      expirationTime: result.rows[0].expiration_time,
      verificationTime: result.rows[0].verification_time,
      challengeId: result.rows[0].challenge_id,
      attemptCount: result.rows[0].attempt_count
    };
  }
  
  async findMfaSessionById(id: string): Promise<MfaSession | null> {
    const result = await query(
      `SELECT * FROM mfa_sessions WHERE id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return {
      id: result.rows[0].id,
      userId: result.rows[0].user_id,
      sessionId: result.rows[0].session_id,
      methodId: result.rows[0].method_id,
      status: result.rows[0].status as MfaSessionStatus,
      creationTime: result.rows[0].creation_time,
      expirationTime: result.rows[0].expiration_time,
      verificationTime: result.rows[0].verification_time,
      challengeId: result.rows[0].challenge_id,
      attemptCount: result.rows[0].attempt_count
    };
  }
  
  async findMfaSessionBySessionId(sessionId: string): Promise<MfaSession | null> {
    const result = await query(
      `SELECT * FROM mfa_sessions 
       WHERE session_id = $1
       ORDER BY creation_time DESC
       LIMIT 1`,
      [sessionId]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return {
      id: result.rows[0].id,
      userId: result.rows[0].user_id,
      sessionId: result.rows[0].session_id,
      methodId: result.rows[0].method_id,
      status: result.rows[0].status as MfaSessionStatus,
      creationTime: result.rows[0].creation_time,
      expirationTime: result.rows[0].expiration_time,
      verificationTime: result.rows[0].verification_time,
      challengeId: result.rows[0].challenge_id,
      attemptCount: result.rows[0].attempt_count
    };
  }
  
  async updateMfaSession(id: string, dto: UpdateMfaSessionDto): Promise<MfaSession | null> {
    const updates: string[] = [];
    const params: any[] = [id]; // First param is always id
    
    if (dto.status !== undefined) {
      params.push(dto.status);
      updates.push(`status = $${params.length}`);
    }
    
    if (dto.verificationTime !== undefined) {
      params.push(dto.verificationTime);
      updates.push(`verification_time = $${params.length}`);
    }
    
    if (dto.attemptCount !== undefined) {
      params.push(dto.attemptCount);
      updates.push(`attempt_count = $${params.length}`);
    }
    
    if (updates.length === 0) {
      return this.findMfaSessionById(id);
    }
    
    const result = await query(
      `UPDATE mfa_sessions
       SET ${updates.join(', ')}
       WHERE id = $1
       RETURNING *`,
      params
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return {
      id: result.rows[0].id,
      userId: result.rows[0].user_id,
      sessionId: result.rows[0].session_id,
      methodId: result.rows[0].method_id,
      status: result.rows[0].status as MfaSessionStatus,
      creationTime: result.rows[0].creation_time,
      expirationTime: result.rows[0].expiration_time,
      verificationTime: result.rows[0].verification_time,
      challengeId: result.rows[0].challenge_id,
      attemptCount: result.rows[0].attempt_count
    };
  }
  
  async completeMfaSession(id: string): Promise<MfaSession | null> {
    return await this.updateMfaSession(id, {
      status: MfaSessionStatus.COMPLETED,
      verificationTime: new Date()
    });
  }
  
  async failMfaSession(id: string): Promise<MfaSession | null> {
    const mfaSession = await this.findMfaSessionById(id);
    
    if (!mfaSession) {
      return null;
    }
    
    return await this.updateMfaSession(id, {
      status: MfaSessionStatus.FAILED,
      attemptCount: (mfaSession.attemptCount || 0) + 1
    });
  }
  
  // Security metrics methods
  async getActiveSessions(organizationId?: string): Promise<number> {
    let sql = `
      SELECT COUNT(*) as count
      FROM sessions s
      WHERE s.revoked = false
      AND s.expiration_time > CURRENT_TIMESTAMP
    `;
    const params: any[] = [];
    
    if (organizationId) {
      sql += `
        AND s.user_id IN (
          SELECT user_id 
          FROM organization_users 
          WHERE organization_id = $1
        )
      `;
      params.push(organizationId);
    }
    
    const result = await query(sql, params);
    
    return parseInt(result.rows[0].count, 10);
  }
  
  async getSessionsByDeviceType(): Promise<{ deviceType: string; count: number }[]> {
    const sql = `
      SELECT 
        COALESCE(
          CASE 
            WHEN s.session_data->>'deviceInfo'->>'isMobile' = 'true' THEN 'Mobile'
            WHEN s.session_data->>'deviceInfo'->>'browser' IS NOT NULL THEN 
              s.session_data->>'deviceInfo'->>'browser' || ' on ' || 
              COALESCE(s.session_data->>'deviceInfo'->>'os', 'Unknown OS')
            ELSE 'Other'
          END,
          'Unknown'
        ) as device_type,
        COUNT(*) as count
      FROM sessions s
      WHERE s.revoked = false
      AND s.expiration_time > CURRENT_TIMESTAMP
      GROUP BY device_type
      ORDER BY count DESC
    `;
    
    const result = await query(sql, []);
    
    return result.rows.map(row => ({
      deviceType: row.device_type,
      count: parseInt(row.count, 10)
    }));
  }
  
  async getSessionsByLocation(): Promise<{ country: string; count: number }[]> {
    const sql = `
      SELECT 
        COALESCE(
          s.session_data->>'requestLocation'->>'country',
          'Unknown'
        ) as country,
        COUNT(*) as count
      FROM sessions s
      WHERE s.revoked = false
      AND s.expiration_time > CURRENT_TIMESTAMP
      GROUP BY country
      ORDER BY count DESC
    `;
    
    const result = await query(sql, []);
    
    return result.rows.map(row => ({
      country: row.country,
      count: parseInt(row.count, 10)
    }));
  }
}
