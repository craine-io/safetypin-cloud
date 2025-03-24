// Organization model that maps to the organizations table in the database

export interface Organization {
  id: string;
  name: string;
  domain: string | null;
  status: OrganizationStatus;
  creationTime: Date;
  subscriptionTier: SubscriptionTier;
  maxUsers: number;
  billingEmail: string | null;
  technicalContactEmail: string | null;
  settings: OrganizationSettings | null;
}

export enum OrganizationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  DELETED = 'deleted'
}

export enum SubscriptionTier {
  FREE = 'free',
  BASIC = 'basic',
  PRO = 'pro',
  ENTERPRISE = 'enterprise'
}

export interface OrganizationSettings {
  // Security settings
  passwordPolicy?: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    passwordExpiryDays: number;
    preventPasswordReuse: number;
  };
  mfaPolicy?: {
    required: boolean;
    allowedMethods: string[];
  };
  sessionPolicy?: {
    sessionTimeoutMinutes: number;
    idleTimeoutMinutes: number;
    maxConcurrentSessions: number;
  };
  
  // SFTP settings
  sftpDefaults?: {
    defaultRegion: string;
    allowedRegions: string[];
    maxStorageGB: number;
    defaultExpiryHours: number;
  };
  
  // UI customization
  branding?: {
    primaryColor: string;
    logoUrl: string;
    favicon: string;
  };
  
  // Any additional settings as needed
  [key: string]: any;
}

export interface CreateOrganizationDto {
  name: string;
  domain?: string;
  status?: OrganizationStatus;
  subscriptionTier?: SubscriptionTier;
  maxUsers?: number;
  billingEmail?: string;
  technicalContactEmail?: string;
  settings?: OrganizationSettings;
}

export interface UpdateOrganizationDto {
  name?: string;
  domain?: string;
  status?: OrganizationStatus;
  subscriptionTier?: SubscriptionTier;
  maxUsers?: number;
  billingEmail?: string;
  technicalContactEmail?: string;
  settings?: OrganizationSettings;
}

export interface OrganizationUser {
  organizationId: string;
  userId: string;
  role: string;
  isOwner: boolean;
  creationTime: Date;
}

export interface OrganizationWithUsers extends Organization {
  users: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: string;
    isOwner: boolean;
  }[];
}
