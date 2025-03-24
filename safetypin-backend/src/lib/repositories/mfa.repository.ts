import { BaseRepository } from './base.repository';
import { 
  MfaMethod,
  CreateMfaMethodDto,
  UpdateMfaMethodDto,
  MfaMethodType,
  BackupCode,
  WebAuthnCredential
} from '../../models/auth/mfa.model';

export interface MfaRepository extends BaseRepository<MfaMethod, CreateMfaMethodDto, UpdateMfaMethodDto> {
  // Find by user
  findByUserId(userId: string): Promise<MfaMethod[]>;
  findByUserIdAndType(userId: string, type: MfaMethodType): Promise<MfaMethod | null>;
  
  // Method status
  activateMethod(id: string): Promise<MfaMethod | null>;
  deactivateMethod(id: string): Promise<MfaMethod | null>;
  
  // Method usage
  updateLastUsed(id: string): Promise<boolean>;
  
  // Backup codes
  createBackupCodes(userId: string, count?: number): Promise<string[]>;
  verifyBackupCode(userId: string, code: string): Promise<boolean>;
  getUnusedBackupCodes(userId: string): Promise<number>;
  replaceBackupCodes(methodId: string, codes: string[]): Promise<string[]>;
  
  // TOTP management
  verifyTotp(userId: string, code: string): Promise<boolean>;
  generateTotpSecret(): Promise<{ secret: string; uri: string; qrCode: string }>;
  
  // SMS management
  sendSmsCode(userId: string): Promise<boolean>;
  verifySmsCode(userId: string, code: string): Promise<boolean>;
  
  // Email management
  sendEmailCode(userId: string): Promise<boolean>;
  verifyEmailCode(userId: string, code: string): Promise<boolean>;
  
  // WebAuthn management
  createWebAuthnCredential(credential: Partial<WebAuthnCredential>): Promise<WebAuthnCredential>;
  findWebAuthnCredential(credentialId: string): Promise<WebAuthnCredential | null>;
  findWebAuthnCredentialsByUserId(userId: string): Promise<WebAuthnCredential[]>;
  updateWebAuthnCounter(credentialId: string, counter: number): Promise<boolean>;
  deleteWebAuthnCredential(credentialId: string): Promise<boolean>;
}
