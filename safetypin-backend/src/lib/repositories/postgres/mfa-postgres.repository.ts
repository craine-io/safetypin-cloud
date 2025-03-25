import { PoolClient } from 'pg';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { BasePostgresRepository } from './base-postgres.repository';
import { MfaRepository } from '../mfa.repository';
import { 
  MfaMethod,
  CreateMfaMethodDto,
  UpdateMfaMethodDto,
  MfaMethodType,
  MfaMethodStatus,
  BackupCode,
  WebAuthnCredential
} from '../../../models/auth/mfa.model';
import { query, transaction } from '../../database/config';

export class MfaPostgresRepository extends BasePostgresRepository<MfaMethod, CreateMfaMethodDto, UpdateMfaMethodDto> implements MfaRepository {
  constructor() {
    super('mfa_methods');
  }
  
  protected mapToEntity(row: any): MfaMethod {
    return {
      id: row.id,
      userId: row.user_id,
      type: row.type as MfaMethodType,
      status: row.status as MfaMethodStatus,
      creationTime: row.creation_time,
      lastUpdateTime: row.last_update_time,
      lastUsedTime: row.last_used_time,
      secret: row.secret,
      phoneNumber: row.phone_number,
      deviceToken: row.device_token,
      backupCodes: row.backup_codes ? JSON.parse(row.backup_codes) : null
    };
  }
  
  protected mapToCreateQuery(dto: CreateMfaMethodDto): { query: string; params: any[] } {
    const id = this.generateId();
    
    // Hash backup codes if provided
    let backupCodes = null;
    if (dto.backupCodes && dto.backupCodes.length > 0) {
      backupCodes = JSON.stringify(dto.backupCodes.map(code => ({
        code: bcrypt.hashSync(code, 10),
        used: false,
        usedAt: null
      })));
    }
    
    const params = [
      id,
      dto.userId,
      dto.type,
      dto.status || MfaMethodStatus.PENDING,
      dto.secret || null,
      dto.phoneNumber || null,
      dto.deviceToken || null,
      backupCodes
    ];
    
    const query = `
      INSERT INTO mfa_methods (
        id, user_id, type, status, secret, phone_number, device_token, backup_codes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    return { query, params };
  }
  
  protected mapToUpdateQuery(dto: UpdateMfaMethodDto): { setClause: string; params: any[] } {
    const updates: string[] = [];
    const params: any[] = [];
    
    if (dto.status !== undefined) {
      params.push(dto.status);
      updates.push(`status = $${params.length}`);
    }
    
    if (dto.secret !== undefined) {
      params.push(dto.secret);
      updates.push(`secret = $${params.length}`);
    }
    
    if (dto.phoneNumber !== undefined) {
      params.push(dto.phoneNumber);
      updates.push(`phone_number = $${params.length}`);
    }
    
    if (dto.deviceToken !== undefined) {
      params.push(dto.deviceToken);
      updates.push(`device_token = $${params.length}`);
    }
    
    if (dto.backupCodes !== undefined) {
      params.push(JSON.stringify(dto.backupCodes));
      updates.push(`backup_codes = $${params.length}`);
    }
    
    const setClause = updates.join(', ');
    
    return { setClause, params };
  }
  
  protected getTransactionRepository(client: PoolClient): MfaRepository {
    // Create a transaction-specific repository that uses the client
    const transactionRepo = new MfaPostgresRepository();
    
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
  
  // MFA repository specific methods
  async findByUserId(userId: string): Promise<MfaMethod[]> {
    const result = await query(
      `SELECT * FROM mfa_methods WHERE user_id = $1`,
      [userId]
    );
    
    return result.rows.map(row => this.mapToEntity(row));
  }
  
  async findByUserIdAndType(userId: string, type: MfaMethodType): Promise<MfaMethod | null> {
    const result = await query(
      `SELECT * FROM mfa_methods 
       WHERE user_id = $1 AND type = $2
       ORDER BY creation_time DESC
       LIMIT 1`,
      [userId, type]
    );
    
    return result.rows.length > 0 ? this.mapToEntity(result.rows[0]) : null;
  }
  
  async activateMethod(id: string): Promise<MfaMethod | null> {
    const result = await query(
      `UPDATE mfa_methods 
       SET status = $2, 
           last_update_time = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id, MfaMethodStatus.ACTIVE]
    );
    
    return result.rows.length > 0 ? this.mapToEntity(result.rows[0]) : null;
  }
  
  async deactivateMethod(id: string): Promise<MfaMethod | null> {
    const result = await query(
      `UPDATE mfa_methods 
       SET status = $2, 
           last_update_time = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id, MfaMethodStatus.INACTIVE]
    );
    
    return result.rows.length > 0 ? this.mapToEntity(result.rows[0]) : null;
  }
  
  async updateLastUsed(id: string): Promise<boolean> {
    const result = await query(
      `UPDATE mfa_methods 
       SET last_used_time = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [id]
    );
    
    return result.rowCount > 0;
  }
  
  // Backup codes
  async createBackupCodes(userId: string, count: number = 10): Promise<string[]> {
    const method = await this.findByUserIdAndType(userId, MfaMethodType.RECOVERY_CODES);
    
    // Generate random backup codes
    const backupCodes: string[] = [];
    for (let i = 0; i < count; i++) {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      backupCodes.push(code);
    }
    
    // If recovery codes method exists, update it with new codes
    if (method) {
      await this.update(method.id, {
        backupCodes: backupCodes.map(code => ({
          code: bcrypt.hashSync(code, 10),
          used: false,
          usedAt: null
        }))
      });
    } else {
      // Create new recovery codes method
      await this.create({
        userId,
        type: MfaMethodType.RECOVERY_CODES,
        status: MfaMethodStatus.ACTIVE,
        backupCodes
      });
    }
    
    return backupCodes;
  }
  
  async verifyBackupCode(userId: string, code: string): Promise<boolean> {
    const method = await this.findByUserIdAndType(userId, MfaMethodType.RECOVERY_CODES);
    
    if (!method || !method.backupCodes || method.backupCodes.length === 0) {
      return false;
    }
    
    // Find the backup code
    for (let i = 0; i < method.backupCodes.length; i++) {
      const backupCode = method.backupCodes[i];
      
      if (!backupCode.used && await bcrypt.compare(code, backupCode.code)) {
        // Mark the code as used
        method.backupCodes[i].used = true;
        method.backupCodes[i].usedAt = new Date();
        
        // Update the method with the used code
        await this.update(method.id, {
          backupCodes: method.backupCodes
        });
        
        return true;
      }
    }
    
    return false;
  }
  
  async getUnusedBackupCodes(userId: string): Promise<number> {
    const method = await this.findByUserIdAndType(userId, MfaMethodType.RECOVERY_CODES);
    
    if (!method || !method.backupCodes) {
      return 0;
    }
    
    return method.backupCodes.filter(code => !code.used).length;
  }
  
  async replaceBackupCodes(methodId: string, codes: string[]): Promise<string[]> {
    // Hash the backup codes
    const backupCodes = codes.map(code => ({
      code: bcrypt.hashSync(code, 10),
      used: false,
      usedAt: null
    }));
    
    // Update the method with new codes
    await this.update(methodId, {
      backupCodes
    });
    
    return codes;
  }
  
  // TOTP management
  async verifyTotp(userId: string, code: string): Promise<boolean> {
    // In a real implementation, this would verify the TOTP code
    // For now, we'll just check if the user has an active TOTP method
    
    const method = await this.findByUserIdAndType(userId, MfaMethodType.TOTP);
    
    if (!method || method.status !== MfaMethodStatus.ACTIVE || !method.secret) {
      return false;
    }
    
    // TODO: Implement actual TOTP verification with a library
    // For now, accept code "123456" for testing
    if (code === "123456") {
      await this.updateLastUsed(method.id);
      return true;
    }
    
    return false;
  }
  
  async generateTotpSecret(): Promise<{ secret: string; uri: string; qrCode: string }> {
    // In a real implementation, this would generate a TOTP secret
    // For now, return a mock implementation
    
    // Generate random secret
    const secret = crypto.randomBytes(10).toString('hex');
    
    return {
      secret,
      uri: `otpauth://totp/SafetyPin:user@example.com?secret=${secret}&issuer=SafetyPin`,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/SafetyPin:user@example.com?secret=${secret}&issuer=SafetyPin`
    };
  }
  
  // SMS management
  async sendSmsCode(userId: string): Promise<boolean> {
    // In a real implementation, this would send an SMS code
    const method = await this.findByUserIdAndType(userId, MfaMethodType.SMS);
    
    if (!method || method.status !== MfaMethodStatus.ACTIVE || !method.phoneNumber) {
      return false;
    }
    
    // TODO: Implement SMS sending
    // For now, return true to indicate success
    return true;
  }
  
  async verifySmsCode(userId: string, code: string): Promise<boolean> {
    // In a real implementation, this would verify the SMS code
    const method = await this.findByUserIdAndType(userId, MfaMethodType.SMS);
    
    if (!method || method.status !== MfaMethodStatus.ACTIVE || !method.phoneNumber) {
      return false;
    }
    
    // TODO: Implement actual SMS code verification
    // For now, accept code "123456" for testing
    if (code === "123456") {
      await this.updateLastUsed(method.id);
      return true;
    }
    
    return false;
  }
  
  // Email management
  async sendEmailCode(userId: string): Promise<boolean> {
    // In a real implementation, this would send an email code
    const method = await this.findByUserIdAndType(userId, MfaMethodType.EMAIL);
    
    if (!method || method.status !== MfaMethodStatus.ACTIVE) {
      return false;
    }
    
    // TODO: Implement email sending
    // For now, return true to indicate success
    return true;
  }
  
  async verifyEmailCode(userId: string, code: string): Promise<boolean> {
    // In a real implementation, this would verify the email code
    const method = await this.findByUserIdAndType(userId, MfaMethodType.EMAIL);
    
    if (!method || method.status !== MfaMethodStatus.ACTIVE) {
      return false;
    }
    
    // TODO: Implement actual email code verification
    // For now, accept code "123456" for testing
    if (code === "123456") {
      await this.updateLastUsed(method.id);
      return true;
    }
    
    return false;
  }
  
  // WebAuthn management
  async createWebAuthnCredential(credential: Partial<WebAuthnCredential>): Promise<WebAuthnCredential> {
    const id = this.generateId();
    
    const result = await query(
      `INSERT INTO webauthn_credentials (
        id, user_id, credential_id, public_key, counter, 
        transports, attestation_type, device_type, name
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        id,
        credential.userId,
        credential.credentialId,
        credential.publicKey,
        credential.counter || 0,
        credential.transports ? JSON.stringify(credential.transports) : null,
        credential.attestationType || null,
        credential.deviceType || null,
        credential.name || null
      ]
    );
    
    return {
      id: result.rows[0].id,
      userId: result.rows[0].user_id,
      credentialId: result.rows[0].credential_id,
      publicKey: result.rows[0].public_key,
      counter: result.rows[0].counter,
      creationTime: result.rows[0].creation_time,
      lastUsedTime: result.rows[0].last_used_time,
      transports: result.rows[0].transports ? JSON.parse(result.rows[0].transports) : undefined,
      attestationType: result.rows[0].attestation_type,
      deviceType: result.rows[0].device_type,
      name: result.rows[0].name
    };
  }
  
  async findWebAuthnCredential(credentialId: string): Promise<WebAuthnCredential | null> {
    const result = await query(
      `SELECT * FROM webauthn_credentials WHERE credential_id = $1`,
      [credentialId]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return {
      id: result.rows[0].id,
      userId: result.rows[0].user_id,
      credentialId: result.rows[0].credential_id,
      publicKey: result.rows[0].public_key,
      counter: result.rows[0].counter,
      creationTime: result.rows[0].creation_time,
      lastUsedTime: result.rows[0].last_used_time,
      transports: result.rows[0].transports ? JSON.parse(result.rows[0].transports) : undefined,
      attestationType: result.rows[0].attestation_type,
      deviceType: result.rows[0].device_type,
      name: result.rows[0].name
    };
  }
  
  async findWebAuthnCredentialsByUserId(userId: string): Promise<WebAuthnCredential[]> {
    const result = await query(
      `SELECT * FROM webauthn_credentials WHERE user_id = $1`,
      [userId]
    );
    
    return result.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      credentialId: row.credential_id,
      publicKey: row.public_key,
      counter: row.counter,
      creationTime: row.creation_time,
      lastUsedTime: row.last_used_time,
      transports: row.transports ? JSON.parse(row.transports) : undefined,
      attestationType: row.attestation_type,
      deviceType: row.device_type,
      name: row.name
    }));
  }
  
  async updateWebAuthnCounter(credentialId: string, counter: number): Promise<boolean> {
    const result = await query(
      `UPDATE webauthn_credentials 
       SET counter = $2, 
           last_used_time = CURRENT_TIMESTAMP
       WHERE credential_id = $1`,
      [credentialId, counter]
    );
    
    return result.rowCount > 0;
  }
  
  async deleteWebAuthnCredential(credentialId: string): Promise<boolean> {
    const result = await query(
      `DELETE FROM webauthn_credentials WHERE credential_id = $1`,
      [credentialId]
    );
    
    return result.rowCount > 0;
  }
}
