// User model that maps to the users table in the database

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  jobTitle: string | null;
  status: UserStatus;
  creationTime: Date;
  lastUpdateTime: Date;
  lastLoginTime: Date | null;
  passwordHash: string | null;
  passwordLastChanged: Date | null;
  forcePasswordChange: boolean;
  avatarUrl: string | null;
  phoneNumber: string | null;
  timezone: string;
  locale: string;
  mfaEnabled: boolean;
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  DELETED = 'deleted'
}

export interface CreateUserDto {
  email: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  status?: UserStatus;
  password?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  timezone?: string;
  locale?: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  status?: UserStatus;
  avatarUrl?: string;
  phoneNumber?: string;
  timezone?: string;
  locale?: string;
  mfaEnabled?: boolean;
}

export interface UserWithOrganizations extends User {
  organizations: {
    id: string;
    name: string;
    role: string;
    isOwner: boolean;
  }[];
}
