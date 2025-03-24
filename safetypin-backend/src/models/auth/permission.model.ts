// Permission models for role-based access control

export interface Permission {
  id: string;
  name: string;
  description: string | null;
  resourceType: string;
  action: string;
  isSystemPermission: boolean;
}

export interface CreatePermissionDto {
  name: string;
  description?: string;
  resourceType: string;
  action: string;
  isSystemPermission?: boolean;
}

export interface UpdatePermissionDto {
  description?: string;
}

export interface Role {
  id: string;
  organizationId: string | null;
  name: string;
  description: string | null;
  isSystemRole: boolean;
  creationTime: Date;
  createdBy: string | null;
  lastUpdateTime: Date;
  updatedBy: string | null;
}

export interface CreateRoleDto {
  organizationId?: string;
  name: string;
  description?: string;
  isSystemRole?: boolean;
  permissions?: string[]; // Permission IDs
  createdBy?: string;
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
  updatedBy?: string;
}

export interface RoleWithPermissions extends Role {
  permissions: Permission[];
}

export interface UserRole {
  userId: string;
  roleId: string;
  organizationId: string | null;
  grantedBy: string | null;
  grantedTime: Date;
}

export interface AssignRoleDto {
  userId: string;
  roleId: string;
  organizationId?: string;
  grantedBy?: string;
}

export interface CheckPermissionParams {
  userId: string;
  permissionName: string;
  organizationId?: string;
  resourceId?: string;
}

export interface PermissionCheck {
  userId: string;
  permissionName: string;
  hasPermission: boolean;
  organizationId?: string;
  resourceId?: string;
}

// Resource-based permission types
export type ResourcePermission = {
  resourceType: string;
  resourceId: string;
  actions: string[];
};

export type UserPermissions = {
  userId: string;
  permissions: string[];
  resourcePermissions: ResourcePermission[];
};
