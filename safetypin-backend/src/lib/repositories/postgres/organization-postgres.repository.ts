import { PoolClient } from 'pg';
import { BasePostgresRepository } from './base-postgres.repository';
import { OrganizationRepository } from '../organization.repository';
import { 
  Organization, 
  CreateOrganizationDto, 
  UpdateOrganizationDto, 
  OrganizationWithUsers,
  OrganizationUser,
  OrganizationStatus,
  SubscriptionTier
} from '../../../models/auth/organization.model';
import { query, transaction } from '../../database/config';

// Define the row type for organization table
interface OrganizationRow {
  id: string;
  name: string;
  domain: string | null;
  status: string;
  creation_time: Date;
  subscription_tier: string;
  max_users: number;
  billing_email: string | null;
  technical_contact_email: string | null;
  settings: string | null;
  last_update_time?: Date;
}

export class OrganizationPostgresRepository 
  extends BasePostgresRepository<Organization, OrganizationRow, CreateOrganizationDto, UpdateOrganizationDto> 
  implements OrganizationRepository 
{
  constructor() {
    super('organizations');
  }
  
  protected mapToEntity(row: OrganizationRow): Organization {
    return {
      id: row.id,
      name: row.name,
      domain: row.domain,
      status: row.status as OrganizationStatus,
      creationTime: row.creation_time,
      subscriptionTier: row.subscription_tier as SubscriptionTier,
      maxUsers: row.max_users,
      billingEmail: row.billing_email,
      technicalContactEmail: row.technical_contact_email,
      settings: row.settings ? JSON.parse(row.settings) : null
    };
  }
  
  protected mapToCreateQuery(dto: CreateOrganizationDto): { query: string; params: any[] } {
    const id = this.generateId();
    const params = [
      id,
      dto.name,
      dto.domain || null,
      dto.status || OrganizationStatus.ACTIVE,
      dto.subscriptionTier || SubscriptionTier.FREE,
      dto.maxUsers || 5, // Default to 5 users for free tier
      dto.billingEmail || null,
      dto.technicalContactEmail || null,
      dto.settings ? JSON.stringify(dto.settings) : null
    ];
    
    const query = `
      INSERT INTO organizations (
        id, name, domain, status, subscription_tier, 
        max_users, billing_email, technical_contact_email, settings
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    return { query, params };
  }
  
  protected mapToUpdateQuery(dto: UpdateOrganizationDto): { setClause: string; params: any[] } {
    const updates: string[] = [];
    const params: any[] = [];
    
    if (dto.name !== undefined) {
      params.push(dto.name);
      updates.push(`name = $${params.length}`);
    }
    
    if (dto.domain !== undefined) {
      params.push(dto.domain);
      updates.push(`domain = $${params.length}`);
    }
    
    if (dto.status !== undefined) {
      params.push(dto.status);
      updates.push(`status = $${params.length}`);
    }
    
    if (dto.subscriptionTier !== undefined) {
      params.push(dto.subscriptionTier);
      updates.push(`subscription_tier = $${params.length}`);
    }
    
    if (dto.maxUsers !== undefined) {
      params.push(dto.maxUsers);
      updates.push(`max_users = $${params.length}`);
    }
    
    if (dto.billingEmail !== undefined) {
      params.push(dto.billingEmail);
      updates.push(`billing_email = $${params.length}`);
    }
    
    if (dto.technicalContactEmail !== undefined) {
      params.push(dto.technicalContactEmail);
      updates.push(`technical_contact_email = $${params.length}`);
    }
    
    if (dto.settings !== undefined) {
      params.push(dto.settings ? JSON.stringify(dto.settings) : null);
      updates.push(`settings = $${params.length}`);
    }
    
    const setClause = updates.join(', ');
    
    return { setClause, params };
  }
  
  protected getTransactionRepository(client: PoolClient): OrganizationRepository {
    // Create a transaction-specific repository that uses the client
    const transactionRepo = new OrganizationPostgresRepository();
    
    // Override methods to use the provided client
    const originalQuery = transactionRepo.findById;
    transactionRepo.findById = async (id: string) => {
      const result = await client.query(
        `SELECT * FROM ${this.tableName} WHERE ${this.idField} = $1`,
        [id]
      );
      
      return result.rows.length > 0 ? this.mapToEntity(result.rows[0] as OrganizationRow) : null;
    };
    
    // Override other methods similarly as needed for transactions
    
    return transactionRepo;
  }
  
  // Organization repository specific methods
  async findByDomain(domain: string): Promise<Organization | null> {
    const result = await query(
      `SELECT * FROM organizations WHERE domain = $1`,
      [domain]
    );
    
    return result.rows.length > 0 ? this.mapToEntity(result.rows[0] as OrganizationRow) : null;
  }
  
  async findByIdWithUsers(id: string): Promise<OrganizationWithUsers | null> {
    const orgResult = await query(
      `SELECT * FROM organizations WHERE id = $1`,
      [id]
    );
    
    if (orgResult.rows.length === 0) {
      return null;
    }
    
    const usersResult = await query(
      `SELECT u.id, u.email, u.first_name, u.last_name, ou.role, ou.is_owner
       FROM users u
       JOIN organization_users ou ON u.id = ou.user_id
       WHERE ou.organization_id = $1`,
      [id]
    );
    
    const organization = this.mapToEntity(orgResult.rows[0] as OrganizationRow);
    const users = usersResult.rows.map(row => ({
      id: row.id,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      role: row.role,
      isOwner: row.is_owner
    }));
    
    return {
      ...organization,
      users
    };
  }
  
  async getOrganizationUsers(organizationId: string): Promise<OrganizationUser[]> {
    const result = await query(
      `SELECT * FROM organization_users WHERE organization_id = $1`,
      [organizationId]
    );
    
    return result.rows.map(row => ({
      organizationId: row.organization_id,
      userId: row.user_id,
      role: row.role,
      isOwner: row.is_owner,
      creationTime: row.creation_time
    }));
  }
  
  async addUserToOrganization(organizationId: string, userId: string, role: string = 'member', isOwner: boolean = false): Promise<OrganizationUser> {
    const result = await query(
      `INSERT INTO organization_users (organization_id, user_id, role, is_owner)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [organizationId, userId, role, isOwner]
    );
    
    return {
      organizationId: result.rows[0].organization_id,
      userId: result.rows[0].user_id,
      role: result.rows[0].role,
      isOwner: result.rows[0].is_owner,
      creationTime: result.rows[0].creation_time
    };
  }
  
  async updateUserRole(organizationId: string, userId: string, role: string): Promise<OrganizationUser | null> {
    const result = await query(
      `UPDATE organization_users
       SET role = $3
       WHERE organization_id = $1 AND user_id = $2
       RETURNING *`,
      [organizationId, userId, role]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return {
      organizationId: result.rows[0].organization_id,
      userId: result.rows[0].user_id,
      role: result.rows[0].role,
      isOwner: result.rows[0].is_owner,
      creationTime: result.rows[0].creation_time
    };
  }
  
  async removeUserFromOrganization(organizationId: string, userId: string): Promise<boolean> {
    const result = await query(
      `DELETE FROM organization_users
       WHERE organization_id = $1 AND user_id = $2`,
      [organizationId, userId]
    );
    
    return result.rowCount > 0;
  }
  
  async findOrganizationsForUser(userId: string): Promise<Organization[]> {
    const result = await query(
      `SELECT o.*
       FROM organizations o
       JOIN organization_users ou ON o.id = ou.organization_id
       WHERE ou.user_id = $1`,
      [userId]
    );
    
    return result.rows.map(row => this.mapToEntity(row as OrganizationRow));
  }
  
  async isUserInOrganization(userId: string, organizationId: string): Promise<boolean> {
    const result = await query(
      `SELECT 1 FROM organization_users
       WHERE organization_id = $1 AND user_id = $2`,
      [organizationId, userId]
    );
    
    return result.rows.length > 0;
  }
  
  async getUserOrganizationRole(userId: string, organizationId: string): Promise<string | null> {
    const result = await query(
      `SELECT role FROM organization_users
       WHERE organization_id = $1 AND user_id = $2`,
      [organizationId, userId]
    );
    
    return result.rows.length > 0 ? result.rows[0].role : null;
  }
  
  async transferOwnership(organizationId: string, fromUserId: string, toUserId: string): Promise<boolean> {
    return await transaction(async (client) => {
      // First verify the current owner
      const verifyResult = await client.query(
        `SELECT 1 FROM organization_users
         WHERE organization_id = $1 AND user_id = $2 AND is_owner = true`,
        [organizationId, fromUserId]
      );
      
      if (verifyResult.rows.length === 0) {
        return false;
      }
      
      // Then verify the target user is in the organization
      const targetResult = await client.query(
        `SELECT 1 FROM organization_users
         WHERE organization_id = $1 AND user_id = $2`,
        [organizationId, toUserId]
      );
      
      if (targetResult.rows.length === 0) {
        return false;
      }
      
      // Remove ownership from the current owner
      await client.query(
        `UPDATE organization_users
         SET is_owner = false
         WHERE organization_id = $1 AND user_id = $2`,
        [organizationId, fromUserId]
      );
      
      // Set ownership for the new owner
      await client.query(
        `UPDATE organization_users
         SET is_owner = true
         WHERE organization_id = $1 AND user_id = $2`,
        [organizationId, toUserId]
      );
      
      return true;
    });
  }
  
  async updateSubscription(id: string, tier: string, maxUsers: number): Promise<Organization | null> {
    const result = await query(
      `UPDATE organizations
       SET subscription_tier = $2, max_users = $3, last_update_time = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id, tier, maxUsers]
    );
    
    return result.rows.length > 0 ? this.mapToEntity(result.rows[0] as OrganizationRow) : null;
  }
  
  async getUserCount(organizationId: string): Promise<number> {
    const result = await query(
      `SELECT COUNT(*) as count
       FROM organization_users
       WHERE organization_id = $1`,
      [organizationId]
    );
    
    return parseInt(result.rows[0].count, 10);
  }
  
  async getActiveUserCount(organizationId: string): Promise<number> {
    const result = await query(
      `SELECT COUNT(*) as count
       FROM organization_users ou
       JOIN users u ON ou.user_id = u.id
       WHERE ou.organization_id = $1 AND u.status = 'active'`,
      [organizationId]
    );
    
    return parseInt(result.rows[0].count, 10);
  }
  
  async findOrganizationByEmailDomain(email: string): Promise<Organization | null> {
    const domain = email.split('@')[1];
    
    if (!domain) {
      return null;
    }
    
    return this.findByDomain(domain);
  }
}
