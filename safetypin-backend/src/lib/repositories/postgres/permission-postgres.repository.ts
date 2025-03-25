import { PoolClient } from 'pg';
import { BasePostgresRepository } from './base-postgres.repository';
import { PermissionRepository } from '../permission.repository';
import { 
  Permission,
  CreatePermissionDto,
  UpdatePermissionDto,
  Role,
  CreateRoleDto,
  UpdateRoleDto,
  RoleWithPermissions,
  UserRole,
  AssignRoleDto,
  CheckPermissionParams,
  PermissionCheck,
  UserPermissions
} from '../../../models/auth/permission.model';
import { query, transaction } from '../../database/config';

export class PermissionPostgresRepository extends BasePostgresRepository<Permission, CreatePermissionDto, UpdatePermissionDto> implements PermissionRepository {
  constructor() {
    super('permissions');
  }
  
  protected mapToEntity(row: any): Permission {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      resourceType: row.resource_type,
      action: row.action,
      isSystemPermission: row.is_system_permission
    };
  }
  
  protected mapToCreateQuery(dto: CreatePermissionDto): { query: string; params: any[] } {
    const id = this.generateId();
    const params = [
      id,
      dto.name,
      dto.description || null,
      dto.resourceType,
      dto.action,
      dto.isSystemPermission !== undefined ? dto.isSystemPermission : false
    ];
    
    const query = `
      INSERT INTO permissions (
        id, name, description, resource_type, action, is_system_permission
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    return { query, params };
  }
  
  protected mapToUpdateQuery(dto: UpdatePermissionDto): { setClause: string; params: any[] } {
    const updates: string[] = [];
    const params: any[] = [];
    
    if (dto.description !== undefined) {
      params.push(dto.description);
      updates.push(`description = $${params.length}`);
    }
    
    const setClause = updates.join(', ');
    
    return { setClause, params };
  }
  
  protected getTransactionRepository(client: PoolClient): PermissionRepository {
    // Create a transaction-specific repository that uses the client
    const transactionRepo = new PermissionPostgresRepository();
    
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
  
  // Helper methods to map database rows to entities
  private mapToRole(row: any): Role {
    return {
      id: row.id,
      organizationId: row.organization_id,
      name: row.name,
      description: row.description,
      isSystemRole: row.is_system_role,
      creationTime: row.creation_time,
      createdBy: row.created_by,
      lastUpdateTime: row.last_update_time,
      updatedBy: row.updated_by
    };
  }
  
  private mapToUserRole(row: any): UserRole {
    return {
      userId: row.user_id,
      roleId: row.role_id,
      organizationId: row.organization_id,
      grantedBy: row.granted_by,
      grantedTime: row.granted_time
    };
  }
  
  // Permission specific methods
  async findByResourceAndAction(resourceType: string, action: string): Promise<Permission | null> {
    const result = await query(
      `SELECT * FROM permissions 
       WHERE resource_type = $1 AND action = $2`,
      [resourceType, action]
    );
    
    return result.rows.length > 0 ? this.mapToEntity(result.rows[0]) : null;
  }
  
  async findByName(name: string): Promise<Permission | null> {
    const result = await query(
      `SELECT * FROM permissions WHERE name = $1`,
      [name]
    );
    
    return result.rows.length > 0 ? this.mapToEntity(result.rows[0]) : null;
  }
  
  async findByNames(names: string[]): Promise<Permission[]> {
    const result = await query(
      `SELECT * FROM permissions WHERE name = ANY($1)`,
      [names]
    );
    
    return result.rows.map(row => this.mapToEntity(row));
  }
  
  // Role operations
  async createRole(dto: CreateRoleDto): Promise<Role> {
    return await transaction(async (client) => {
      const id = this.generateId();
      const params = [
        id,
        dto.organizationId || null,
        dto.name,
        dto.description || null,
        dto.isSystemRole !== undefined ? dto.isSystemRole : false,
        dto.createdBy || null
      ];
      
      const result = await client.query(
        `INSERT INTO roles (
          id, organization_id, name, description, is_system_role, created_by
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        params
      );
      
      // Add permissions if provided
      if (dto.permissions && dto.permissions.length > 0) {
        const values = dto.permissions.map((permissionId, index) => {
          return `($1, $${index + 2})`;
        });
        
        await client.query(
          `INSERT INTO role_permissions (role_id, permission_id)
           VALUES ${values.join(', ')}`,
          [id, ...dto.permissions]
        );
      }
      
      return this.mapToRole(result.rows[0]);
    });
  }
  
  async findRoleById(id: string): Promise<Role | null> {
    const result = await query(
      `SELECT * FROM roles WHERE id = $1`,
      [id]
    );
    
    return result.rows.length > 0 ? this.mapToRole(result.rows[0]) : null;
  }
  
  async findRoleWithPermissions(id: string): Promise<RoleWithPermissions | null> {
    const roleResult = await query(
      `SELECT * FROM roles WHERE id = $1`,
      [id]
    );
    
    if (roleResult.rows.length === 0) {
      return null;
    }
    
    const permissionsResult = await query(
      `SELECT p.* 
       FROM permissions p
       JOIN role_permissions rp ON p.id = rp.permission_id
       WHERE rp.role_id = $1`,
      [id]
    );
    
    const role = this.mapToRole(roleResult.rows[0]);
    const permissions = permissionsResult.rows.map(row => this.mapToEntity(row));
    
    return {
      ...role,
      permissions
    };
  }
  
  async findRoleByName(name: string, organizationId?: string): Promise<Role | null> {
    let sql = `SELECT * FROM roles WHERE name = $1`;
    const params: any[] = [name];
    
    if (organizationId !== undefined) {
      sql += ` AND organization_id = $2`;
      params.push(organizationId);
    }
    
    const result = await query(sql, params);
    
    return result.rows.length > 0 ? this.mapToRole(result.rows[0]) : null;
  }
  
  async updateRole(id: string, dto: UpdateRoleDto): Promise<Role | null> {
    const updates: string[] = [];
    const params: any[] = [];
    
    if (dto.name !== undefined) {
      params.push(dto.name);
      updates.push(`name = $${params.length}`);
    }
    
    if (dto.description !== undefined) {
      params.push(dto.description);
      updates.push(`description = $${params.length}`);
    }
    
    if (dto.updatedBy !== undefined) {
      params.push(dto.updatedBy);
      updates.push(`updated_by = $${params.length}`);
    }
    
    if (updates.length === 0) {
      return this.findRoleById(id);
    }
    
    params.push(id);
    
    const result = await query(
      `UPDATE roles
       SET ${updates.join(', ')}, last_update_time = CURRENT_TIMESTAMP
       WHERE id = $${params.length}
       RETURNING *`,
      params
    );
    
    return result.rows.length > 0 ? this.mapToRole(result.rows[0]) : null;
  }
  
  async deleteRole(id: string): Promise<boolean> {
    return await transaction(async (client) => {
      // First delete role-permission associations
      await client.query(
        `DELETE FROM role_permissions WHERE role_id = $1`,
        [id]
      );
      
      // Then delete user-role associations
      await client.query(
        `DELETE FROM user_roles WHERE role_id = $1`,
        [id]
      );
      
      // Finally delete the role
      const result = await client.query(
        `DELETE FROM roles WHERE id = $1`,
        [id]
      );
      
      return result.rowCount > 0;
    });
  }
  
  // System roles
  async getSystemRoles(): Promise<Role[]> {
    const result = await query(
      `SELECT * FROM roles WHERE is_system_role = true`,
      []
    );
    
    return result.rows.map(row => this.mapToRole(row));
  }
  
  // Organization roles
  async getOrganizationRoles(organizationId: string): Promise<Role[]> {
    const result = await query(
      `SELECT * FROM roles 
       WHERE organization_id = $1 OR (organization_id IS NULL AND is_system_role = true)
       ORDER BY name ASC`,
      [organizationId]
    );
    
    return result.rows.map(row => this.mapToRole(row));
  }
  
  // Role permissions
  async addPermissionToRole(roleId: string, permissionId: string): Promise<boolean> {
    try {
      await query(
        `INSERT INTO role_permissions (role_id, permission_id)
         VALUES ($1, $2)
         ON CONFLICT (role_id, permission_id) DO NOTHING`,
        [roleId, permissionId]
      );
      
      return true;
    } catch (error) {
      console.error('Error adding permission to role:', error);
      return false;
    }
  }
  
  async removePermissionFromRole(roleId: string, permissionId: string): Promise<boolean> {
    const result = await query(
      `DELETE FROM role_permissions
       WHERE role_id = $1 AND permission_id = $2`,
      [roleId, permissionId]
    );
    
    return result.rowCount > 0;
  }
  
  async setRolePermissions(roleId: string, permissionIds: string[]): Promise<boolean> {
    return await transaction(async (client) => {
      // First delete all existing permissions
      await client.query(
        `DELETE FROM role_permissions WHERE role_id = $1`,
        [roleId]
      );
      
      // Then add the new permissions
      if (permissionIds.length > 0) {
        const values = permissionIds.map((_, index) => {
          return `($1, $${index + 2})`;
        });
        
        await client.query(
          `INSERT INTO role_permissions (role_id, permission_id)
           VALUES ${values.join(', ')}`,
          [roleId, ...permissionIds]
        );
      }
      
      return true;
    });
  }
  
  async getRolePermissions(roleId: string): Promise<Permission[]> {
    const result = await query(
      `SELECT p.* 
       FROM permissions p
       JOIN role_permissions rp ON p.id = rp.permission_id
       WHERE rp.role_id = $1`,
      [roleId]
    );
    
    return result.rows.map(row => this.mapToEntity(row));
  }
  
  // User roles
  async assignRoleToUser(dto: AssignRoleDto): Promise<UserRole> {
    const result = await query(
      `INSERT INTO user_roles (user_id, role_id, organization_id, granted_by)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, role_id, COALESCE(organization_id, '00000000-0000-0000-0000-000000000000'))
       DO UPDATE SET granted_by = $4, granted_time = CURRENT_TIMESTAMP
       RETURNING *`,
      [dto.userId, dto.roleId, dto.organizationId || null, dto.grantedBy || null]
    );
    
    return this.mapToUserRole(result.rows[0]);
  }
  
  async removeRoleFromUser(userId: string, roleId: string, organizationId?: string): Promise<boolean> {
    let sql = `DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2`;
    const params: any[] = [userId, roleId];
    
    if (organizationId !== undefined) {
      sql += ` AND organization_id = $3`;
      params.push(organizationId);
    } else {
      sql += ` AND organization_id IS NULL`;
    }
    
    const result = await query(sql, params);
    
    return result.rowCount > 0;
  }
  
  async getUserRoles(userId: string, organizationId?: string): Promise<Role[]> {
    let sql = `
      SELECT r.* 
      FROM roles r
      JOIN user_roles ur ON r.id = ur.role_id
      WHERE ur.user_id = $1
    `;
    const params: any[] = [userId];
    
    if (organizationId !== undefined) {
      sql += ` AND (ur.organization_id = $2 OR (r.is_system_role = true AND ur.organization_id IS NULL))`;
      params.push(organizationId);
    }
    
    const result = await query(sql, params);
    
    return result.rows.map(row => this.mapToRole(row));
  }
  
  // Permission checking
  async checkPermission(params: CheckPermissionParams): Promise<PermissionCheck> {
    const { userId, permissionName, organizationId, resourceId } = params;
    
    // Build the query to check if user has the specified permission
    let sql = `
      SELECT 1
      FROM user_roles ur
      JOIN role_permissions rp ON ur.role_id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.id
      WHERE ur.user_id = $1
      AND p.name = $2
    `;
    
    const queryParams: any[] = [userId, permissionName];
    
    if (organizationId !== undefined) {
      sql += ` AND (ur.organization_id = $3 OR (ur.organization_id IS NULL AND p.is_system_permission = true))`;
      queryParams.push(organizationId);
    }
    
    const result = await query(sql, queryParams);
    
    return {
      userId,
      permissionName,
      hasPermission: result.rows.length > 0,
      organizationId,
      resourceId
    };
  }
  
  async getUserPermissions(userId: string, organizationId?: string): Promise<UserPermissions> {
    // Get all permissions for the user
    let sql = `
      SELECT DISTINCT p.name, p.resource_type, p.action
      FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      JOIN user_roles ur ON rp.role_id = ur.role_id
      WHERE ur.user_id = $1
    `;
    
    const params: any[] = [userId];
    
    if (organizationId !== undefined) {
      sql += ` AND (ur.organization_id = $2 OR (ur.organization_id IS NULL AND p.is_system_permission = true))`;
      params.push(organizationId);
    }
    
    const result = await query(sql, params);
    
    // Process the results
    const permissions: string[] = [];
    const resourcePermissionsMap = new Map<string, Map<string, Set<string>>>();
    
    for (const row of result.rows) {
      // Add to the flat permissions list
      permissions.push(row.name);
      
      // Add to resource permissions mapping
      if (!resourcePermissionsMap.has(row.resource_type)) {
        resourcePermissionsMap.set(row.resource_type, new Map<string, Set<string>>());
      }
      
      // For now, we're not tracking specific resource IDs in this implementation
      const resourceId = '*'; // Wildcard for all resources of this type
      const resourceTypeMap = resourcePermissionsMap.get(row.resource_type)!;
      
      if (!resourceTypeMap.has(resourceId)) {
        resourceTypeMap.set(resourceId, new Set<string>());
      }
      
      resourceTypeMap.get(resourceId)!.add(row.action);
    }
    
    // Convert the map to the expected format
    const resourcePermissions = Array.from(resourcePermissionsMap.entries()).map(([resourceType, resourceMap]) => {
      return Array.from(resourceMap.entries()).map(([resourceId, actions]) => {
        return {
          resourceType,
          resourceId,
          actions: Array.from(actions)
        };
      });
    }).flat();
    
    return {
      userId,
      permissions,
      resourcePermissions
    };
  }
  
  async hasPermission(userId: string, permissionName: string, organizationId?: string): Promise<boolean> {
    const result = await this.checkPermission({
      userId,
      permissionName,
      organizationId
    });
    
    return result.hasPermission;
  }
  
  async hasAnyPermission(userId: string, permissionNames: string[], organizationId?: string): Promise<boolean> {
    if (permissionNames.length === 0) {
      return false;
    }
    
    // Build the query to check if user has any of the specified permissions
    let sql = `
      SELECT 1
      FROM user_roles ur
      JOIN role_permissions rp ON ur.role_id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.id
      WHERE ur.user_id = $1
      AND p.name = ANY($2)
    `;
    
    const params: any[] = [userId, permissionNames];
    
    if (organizationId !== undefined) {
      sql += ` AND (ur.organization_id = $3 OR (ur.organization_id IS NULL AND p.is_system_permission = true))`;
      params.push(organizationId);
    }
    
    sql += ` LIMIT 1`;
    
    const result = await query(sql, params);
    
    return result.rows.length > 0;
  }
  
  async hasAllPermissions(userId: string, permissionNames: string[], organizationId?: string): Promise<boolean> {
    if (permissionNames.length === 0) {
      return true;
    }
    
    // Build the query to count how many of the specified permissions the user has
    let sql = `
      SELECT COUNT(DISTINCT p.name) as permission_count
      FROM user_roles ur
      JOIN role_permissions rp ON ur.role_id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.id
      WHERE ur.user_id = $1
      AND p.name = ANY($2)
    `;
    
    const params: any[] = [userId, permissionNames];
    
    if (organizationId !== undefined) {
      sql += ` AND (ur.organization_id = $3 OR (ur.organization_id IS NULL AND p.is_system_permission = true))`;
      params.push(organizationId);
    }
    
    const result = await query(sql, params);
    
    const count = parseInt(result.rows[0].permission_count, 10);
    return count === permissionNames.length;
  }
}
