import { BaseRepository } from './base.repository';
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
} from '../../models/auth/permission.model';

export interface PermissionRepository extends BaseRepository<Permission, CreatePermissionDto, UpdatePermissionDto> {
  // Find by resource and action
  findByResourceAndAction(resourceType: string, action: string): Promise<Permission | null>;
  findByName(name: string): Promise<Permission | null>;
  findByNames(names: string[]): Promise<Permission[]>;
  
  // Role operations
  createRole(dto: CreateRoleDto): Promise<Role>;
  findRoleById(id: string): Promise<Role | null>;
  findRoleWithPermissions(id: string): Promise<RoleWithPermissions | null>;
  findRoleByName(name: string, organizationId?: string): Promise<Role | null>;
  updateRole(id: string, dto: UpdateRoleDto): Promise<Role | null>;
  deleteRole(id: string): Promise<boolean>;
  
  // System roles
  getSystemRoles(): Promise<Role[]>;
  
  // Organization roles
  getOrganizationRoles(organizationId: string): Promise<Role[]>;
  
  // Role permissions
  addPermissionToRole(roleId: string, permissionId: string): Promise<boolean>;
  removePermissionFromRole(roleId: string, permissionId: string): Promise<boolean>;
  setRolePermissions(roleId: string, permissionIds: string[]): Promise<boolean>;
  getRolePermissions(roleId: string): Promise<Permission[]>;
  
  // User roles
  assignRoleToUser(dto: AssignRoleDto): Promise<UserRole>;
  removeRoleFromUser(userId: string, roleId: string, organizationId?: string): Promise<boolean>;
  getUserRoles(userId: string, organizationId?: string): Promise<Role[]>;
  
  // Permission checking
  checkPermission(params: CheckPermissionParams): Promise<PermissionCheck>;
  getUserPermissions(userId: string, organizationId?: string): Promise<UserPermissions>;
  hasPermission(userId: string, permissionName: string, organizationId?: string): Promise<boolean>;
  hasAnyPermission(userId: string, permissionNames: string[], organizationId?: string): Promise<boolean>;
  hasAllPermissions(userId: string, permissionNames: string[], organizationId?: string): Promise<boolean>;
}
