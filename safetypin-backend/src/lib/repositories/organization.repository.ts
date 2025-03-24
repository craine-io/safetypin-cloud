import { BaseRepository } from './base.repository';
import { 
  Organization,
  CreateOrganizationDto,
  UpdateOrganizationDto,
  OrganizationWithUsers,
  OrganizationUser
} from '../../models/auth/organization.model';

export interface OrganizationRepository extends BaseRepository<Organization, CreateOrganizationDto, UpdateOrganizationDto> {
  // Find by domain
  findByDomain(domain: string): Promise<Organization | null>;
  
  // Organization with users
  findByIdWithUsers(id: string): Promise<OrganizationWithUsers | null>;
  
  // Organization users management
  getOrganizationUsers(organizationId: string): Promise<OrganizationUser[]>;
  addUserToOrganization(organizationId: string, userId: string, role?: string, isOwner?: boolean): Promise<OrganizationUser>;
  updateUserRole(organizationId: string, userId: string, role: string): Promise<OrganizationUser | null>;
  removeUserFromOrganization(organizationId: string, userId: string): Promise<boolean>;
  
  // Find user's organizations
  findOrganizationsForUser(userId: string): Promise<Organization[]>;
  
  // Check if user is in organization
  isUserInOrganization(userId: string, organizationId: string): Promise<boolean>;
  getUserOrganizationRole(userId: string, organizationId: string): Promise<string | null>;
  
  // Organization ownership
  transferOwnership(organizationId: string, fromUserId: string, toUserId: string): Promise<boolean>;
  
  // Subscription management
  updateSubscription(id: string, tier: string, maxUsers: number): Promise<Organization | null>;
  
  // Metadata and stats
  getUserCount(organizationId: string): Promise<number>;
  getActiveUserCount(organizationId: string): Promise<number>;
  
  // Auto-assign organization by email domain
  findOrganizationByEmailDomain(email: string): Promise<Organization | null>;
}
