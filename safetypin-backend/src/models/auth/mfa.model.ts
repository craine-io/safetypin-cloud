// MFA models for multi-factor authentication

export interface MfaMethod {
  id: string;
  userId: string;
  type: MfaMethodType;
  status: MfaMethodStatus;
  creationTime: Date;
  lastUpdateTime: Date;
  lastUsedTime: Date | null;
  secret: string | null; // Encrypted secret for TOTP
  phoneNumber: string | null; // For SMS
  deviceToken: string | null; // For push notifications
  backupCodes: BackupCode[] | null; // Encrypted backup codes
}

export enum MfaMethodType {
  TOTP = 'totp',
  SMS = 'sms',
  EMAIL = 'email',
  PUSH = 'push',
  RECOVERY_CODES = 'recovery_codes',
  WEBAUTHN = 'webauthn'
}

export enum MfaMethodStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  REVOKED = 'revoked'
}

export interface BackupCode {
  code: string; // Hashed code
  used: boolean;
  usedAt: Date | null;
}

export interface CreateMfaMethodDto {
  userId: string;
  type: MfaMethodType;
  status?: MfaMethodStatus;
  secret?: string;
  phoneNumber?: string;
  deviceToken?: string;
  backupCodes?: string[]; // Plain backup codes to be hashed
}

export interface UpdateMfaMethodDto {
  status?: MfaMethodStatus;
  secret?: string;
  phoneNumber?: string;
  deviceToken?: string;
  backupCodes?: BackupCode[];
}

// MFA verification models
export interface MfaVerification {
  methodId: string;
  code: string;
  remember?: boolean; // Whether to remember this device
}

export interface MfaSetupResponse {
  methodId: string;
  secret?: string;
  qrCodeUrl?: string;
  backupCodes?: string[];
  verificationRequired: boolean;
}

export interface MfaChallenge {
  id: string;
  methodId: string;
  creationTime: Date;
  expirationTime: Date;
  deliveryStatus?: string;
  deliveryDestination?: string; // Masked phone number or email
}

// WebAuthn models for FIDO2/WebAuthn support
export interface WebAuthnCredential {
  id: string;
  userId: string;
  credentialId: string; // Base64 encoded credential ID
  publicKey: string; // Base64 encoded public key
  counter: number;
  creationTime: Date;
  lastUsedTime: Date | null;
  transports?: string[];
  attestationType?: string;
  deviceType?: string;
  name?: string; // User-friendly name for the credential
}

export interface WebAuthnRegistrationOptions {
  rp: {
    name: string;
    id?: string;
  };
  user: {
    id: string;
    name: string;
    displayName: string;
  };
  challenge: string;
  pubKeyCredParams: {
    type: string;
    alg: number;
  }[];
  timeout?: number;
  excludeCredentials?: {
    id: string;
    type: string;
    transports?: string[];
  }[];
  authenticatorSelection?: {
    authenticatorAttachment?: string;
    requireResidentKey?: boolean;
    residentKey?: string;
    userVerification?: string;
  };
  attestation?: string;
}

export interface WebAuthnAuthenticationOptions {
  challenge: string;
  timeout?: number;
  rpId?: string;
  allowCredentials: {
    id: string;
    type: string;
    transports?: string[];
  }[];
  userVerification?: string;
}
