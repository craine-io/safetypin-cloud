import { PoolClient } from 'pg';
import * as bcrypt from 'bcryptjs';
import { BasePostgresRepository } from './base-postgres.repository';
import { UserRepository } from '../user.repository';
import { 
  User, 
  CreateUserDto, 
  UpdateUserDto, 
  UserStatus,
  UserWithOrganizations 
} from '../../../models/auth/user.model';
import { query, transaction } from '../../database/config';

export class UserPostgresRepository extends BasePostgresRepository<User, CreateUserDto, UpdateUserDto> implements UserRepository {
  constructor() {
    super('users');
  }
  
  protected mapToEntity(row: any): User {
    return {
      id: row.id,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      jobTitle: row.job_title,
      status: row.status as UserStatus,
      creationTime: row.creation_time,
      lastUpdateTime: row.last_update_time,
      lastLoginTime: row.last_login_time,
      passwordHash: row.password_hash,
      passwordLastChanged: row.password_last_changed,
      forcePasswordChange: row.force_password_change,
      avatarUrl: row.avatar_url,
      phoneNumber: row.phone_number,
      timezone: row.timezone,
      locale: row.locale,
      mfaEnabled: row.mfa_enabled
    };
  }
  
  protected mapToCreateQuery(dto: CreateUserDto): { query: string; params: any[] } {
    const id = this.generateId();
    const params = [
      id,
      dto.email,
      dto.firstName || null,
      dto.lastName || null,
      dto.jobTitle || null,
      dto.status || UserStatus.ACTIVE,
      dto.password ? bcrypt.hashSync(dto.password, 10) : null,
      dto.avatarUrl || null,
      dto.phoneNumber || null,
      dto.timezone || 'UTC',
      dto.locale || 'en-US'
    ];
    
    const query = `
      INSERT INTO users (
        id, email, first_name, last_name, job_title, status, 
        password_hash, avatar_url, phone_number, timezone, locale
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    
    return { query, params };
  }
  
  protected mapToUpdateQuery(dto: UpdateUserDto): { setClause: string; params: any[] } {
    const updates: string[] = [];
    const params: any[] = [];
    
    if (dto.firstName !== undefined) {
      params.push(dto.firstName);
      updates.push(`first_name = $${params.length}`);
    }
    
    if (dto.lastName !== undefined) {
      params.push(dto.lastName);
      updates.push(`last_name = $${params.length}`);
    }
    
    if (dto.jobTitle !== undefined) {
      params.push(dto.jobTitle);
      updates.push(`job_title = $${params.length}`);
    }
    
    if (dto.status !== undefined) {
      params.push(dto.status);
      updates.push(`status = $${params.length}`);
    }
    
    if (dto.avatarUrl !== undefined) {
      params.push(dto.avatarUrl);
      updates.push(`avatar_url = $${params.length}`);
    }
    
    if (dto.phoneNumber !== undefined) {
      params.push(dto.phoneNumber);
      updates.push(`phone_number = $${params.length}`);
    }
    
    if (dto.timezone !== undefined) {
      params.push(dto.timezone);
      updates.push(`timezone = $${params.length}`);
    }
    
    if (dto.locale !== undefined) {
      params.push(dto.locale);
      updates.push(`locale = $${params.length}`);
    }
    
    if (dto.mfaEnabled !== undefined) {
      params.push(dto.mfaEnabled);
      updates.push(`mfa_enabled = $${params.length}`);
    }
    
    const setClause = updates.join(', ');
    
    return { setClause, params };
  }
  
  protected getTransactionRepository(client: PoolClient): UserRepository {
    // Create a transaction-specific repository that uses the client
    const transactionRepo = new UserPostgresRepository();
    
    // Override methods to use the provided client
    const originalQuery = transactionRepo.findById;
    transactionRepo.findById = async (id: string) => {
      const result = await client.query(
        `SELECT * FROM ${this.tableName} WHERE ${this.idField} = $1`,
        [id]
      );
      
      return result.rows.length > 0 ? this.mapToEntity(result.rows[0]) : null;
    };
    
    // Override other methods similarly as needed for transactions
    
    return transactionRepo;
  }
  
  // User repository specific methods
  async findByEmail(email: string): Promise<User | null> {
    const result = await query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    
    return result.rows.length > 0 ? this.mapToEntity(result.rows[0]) : null;
  }
  
  async findByIdWithOrganizations(id: string): Promise<UserWithOrganizations | null> {
    const userResult = await query(
      `SELECT * FROM users WHERE id = $1`,
      [id]
    );
    
    if (userResult.rows.length === 0) {
      return null;
    }
    
    const orgResult = await query(
      `SELECT o.id, o.name, ou.role, ou.is_owner
       FROM organizations o
       JOIN organization_users ou ON o.id = ou.organization_id
       WHERE ou.user_id = $1`,
      [id]
    );
    
    const user = this.mapToEntity(userResult.rows[0]);
    const organizations = orgResult.rows.map(row => ({
      id: row.id,
      name: row.name,
      role: row.role,
      isOwner: row.is_owner
    }));
    
    return {
      ...user,
      organizations
    };
  }
  
  async findForAuthentication(email: string): Promise<User | null> {
    const result = await query(
      `SELECT * FROM users WHERE email = $1 AND status = 'active'`,
      [email]
    );
    
    return result.rows.length > 0 ? this.mapToEntity(result.rows[0]) : null;
  }
  
  async validateCredentials(email: string, password: string): Promise<User | null> {
    const user = await this.findForAuthentication(email);
    
    if (!user || !user.passwordHash) {
      return null;
    }
    
    const isValid = await bcrypt.compare(password, user.passwordHash);
    
    return isValid ? user : null;
  }
  
  async updatePassword(id: string, newPassword: string): Promise<boolean> {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    
    const result = await query(
      `UPDATE users 
       SET password_hash = $1, 
           password_last_changed = CURRENT_TIMESTAMP,
           force_password_change = false,
           last_update_time = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [passwordHash, id]
    );
    
    return result.rowCount > 0;
  }
  
  async checkPassword(id: string, password: string): Promise<boolean> {
    const result = await query(
      `SELECT password_hash FROM users WHERE id = $1`,
      [id]
    );
    
    if (result.rows.length === 0 || !result.rows[0].password_hash) {
      return false;
    }
    
    return bcrypt.compare(password, result.rows[0].password_hash);
  }
  
  async resetPassword(id: string, newPassword: string): Promise<boolean> {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    
    const result = await query(
      `UPDATE users 
       SET password_hash = $1, 
           password_last_changed = CURRENT_TIMESTAMP,
           force_password_change = true,
           last_update_time = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [passwordHash, id]
    );
    
    return result.rowCount > 0;
  }
  
  async updateMfaStatus(id: string, enabled: boolean): Promise<boolean> {
    const result = await query(
      `UPDATE users 
       SET mfa_enabled = $1,
           last_update_time = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [enabled, id]
    );
    
    return result.rowCount > 0;
  }
  
  async suspend(id: string): Promise<boolean> {
    const result = await query(
      `UPDATE users 
       SET status = $1,
           last_update_time = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [UserStatus.SUSPENDED, id]
    );
    
    return result.rowCount > 0;
  }
  
  async activate(id: string): Promise<boolean> {
    const result = await query(
      `UPDATE users 
       SET status = $1,
           last_update_time = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [UserStatus.ACTIVE, id]
    );
    
    return result.rowCount > 0;
  }
  
  async getUserOrganizations(userId: string): Promise<{ id: string; name: string; role: string; isOwner: boolean; }[]> {
    const result = await query(
      `SELECT o.id, o.name, ou.role, ou.is_owner
       FROM organizations o
       JOIN organization_users ou ON o.id = ou.organization_id
       WHERE ou.user_id = $1`,
      [userId]
    );
    
    return result.rows.map(row => ({
      id: row.id,
      name: row.name,
      role: row.role,
      isOwner: row.is_owner
    }));
  }
  
  async searchUsers(query: string, organizationId?: string): Promise<User[]> {
    let sql = `
      SELECT u.*
      FROM users u
    `;
    
    const params: any[] = [];
    
    if (organizationId) {
      sql += `
        JOIN organization_users ou ON u.id = ou.user_id
        WHERE ou.organization_id = $1
          AND (
            u.email ILIKE $2
            OR u.first_name ILIKE $2
            OR u.last_name ILIKE $2
          )
      `;
      params.push(organizationId, `%${query}%`);
    } else {
      sql += `
        WHERE u.email ILIKE $1
          OR u.first_name ILIKE $1
          OR u.last_name ILIKE $1
      `;
      params.push(`%${query}%`);
    }
    
    const result = await query(sql, params);
    
    return result.rows.map(row => this.mapToEntity(row));
  }
  
  async getRecentlyActiveUsers(days: number, organizationId?: string): Promise<{ id: string; email: string; lastLoginTime: Date; }[]> {
    let sql = `
      SELECT u.id, u.email, u.last_login_time
      FROM users u
    `;
    
    const params: any[] = [days];
    
    if (organizationId) {
      sql += `
        JOIN organization_users ou ON u.id = ou.user_id
        WHERE ou.organization_id = $2
          AND u.last_login_time > (CURRENT_TIMESTAMP - INTERVAL '1 day' * $1)
        ORDER BY u.last_login_time DESC
      `;
      params.push(organizationId);
    } else {
      sql += `
        WHERE u.last_login_time > (CURRENT_TIMESTAMP - INTERVAL '1 day' * $1)
        ORDER BY u.last_login_time DESC
      `;
    }
    
    const result = await query(sql, params);
    
    return result.rows.map(row => ({
      id: row.id,
      email: row.email,
      lastLoginTime: row.last_login_time
    }));
  }
  
  async updateWithAudit(id: string, dto: UpdateUserDto, actingUserId: string): Promise<User | null> {
    return await transaction(async (client) => {
      // First update the user
      const { setClause, params } = this.mapToUpdateQuery(dto);
      
      if (!setClause) {
        // No fields to update
        return this.findById(id);
      }
      
      const result = await client.query(
        `UPDATE users
         SET ${setClause}, last_update_time = CURRENT_TIMESTAMP
         WHERE id = $${params.length + 1}
         RETURNING *`,
        [...params, id]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      // Create audit log entry
      await client.query(
        `INSERT INTO auth_audit_logs (
          id, event_type, user_id, acting_user_id, result, resource_type, resource_id, additional_data
        )
        VALUES (
          $1, 'user_updated', $2, $3, 'success', 'user', $4, $5
        )`,
        [
          this.generateId(),
          id,
          actingUserId,
          id,
          JSON.stringify(dto)
        ]
      );
      
      return this.mapToEntity(result.rows[0]);
    });
  }
}
