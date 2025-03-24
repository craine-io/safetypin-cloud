import { BaseRepository } from './base.repository';
import { 
  User, 
  CreateUserDto, 
  UpdateUserDto, 
  UserWithOrganizations 
} from '../../models/auth/user.model';

export interface UserRepository extends BaseRepository<User, CreateUserDto, UpdateUserDto> {
  // Find by email
  findByEmail(email: string): Promise<User | null>;
  
  // Find with organizations
  findByIdWithOrganizations(id: string): Promise<UserWithOrganizations | null>;
  
  // Authentication
  findForAuthentication(email: string): Promise<User | null>;
  validateCredentials(email: string, password: string): Promise<User | null>;
  
  // Password management
  updatePassword(id: string, newPassword: string): Promise<boolean>;
  checkPassword(id: string, password: string): Promise<boolean>;
  resetPassword(id: string, newPassword: string): Promise<boolean>;
  
  // MFA
  updateMfaStatus(id: string, enabled: boolean): Promise<boolean>;
  
  // User status
  suspend(id: string): Promise<boolean>;
  activate(id: string): Promise<boolean>;
  
  // User organizations
  getUserOrganizations(userId: string): Promise<{ 
    id: string; 
    name: string; 
    role: string;
    isOwner: boolean;
  }[]>;
  
  // Advanced searches
  searchUsers(query: string, organizationId?: string): Promise<User[]>;
  
  // Security metrics
  getRecentlyActiveUsers(days: number, organizationId?: string): Promise<{ 
    id: string;
    email: string;
    lastLoginTime: Date;
  }[]>;
  
  // Updates with audit
  updateWithAudit(id: string, dto: UpdateUserDto, actingUserId: string): Promise<User | null>;
}
