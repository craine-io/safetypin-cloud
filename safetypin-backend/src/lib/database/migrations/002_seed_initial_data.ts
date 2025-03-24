import { PoolClient } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';

// Seed initial data for development and testing
export async function up(client: PoolClient): Promise<void> {
  // Seed default cloud providers
  const awsId = uuidv4();
  const azureId = uuidv4();
  const gcpId = uuidv4();

  await client.query(`
    INSERT INTO cloud_providers (id, name, display_name, status, capabilities)
    VALUES 
      ($1, 'aws', 'Amazon Web Services', 'active', '{"sftp": true, "s3": true, "transfer_family": true}'),
      ($2, 'azure', 'Microsoft Azure', 'active', '{"sftp": true, "blob_storage": true}'),
      ($3, 'gcp', 'Google Cloud Platform', 'active', '{"sftp": true, "cloud_storage": true}')
    ON CONFLICT (name) DO NOTHING;
  `, [awsId, azureId, gcpId]);

  // Seed system-level permissions
  const permissionIds = {
    // User permissions
    viewUsers: uuidv4(),
    createUsers: uuidv4(),
    updateUsers: uuidv4(),
    deleteUsers: uuidv4(),
    
    // Server permissions
    viewServers: uuidv4(),
    createServers: uuidv4(),
    updateServers: uuidv4(),
    deleteServers: uuidv4(),
    
    // Organization permissions
    viewOrganization: uuidv4(),
    updateOrganization: uuidv4(),
    manageSubscription: uuidv4(),
    manageCloudCredentials: uuidv4(),
    
    // IdP permissions
    viewIdP: uuidv4(),
    createIdP: uuidv4(),
    updateIdP: uuidv4(),
    deleteIdP: uuidv4(),
    
    // Role permissions
    viewRoles: uuidv4(),
    createRoles: uuidv4(),
    updateRoles: uuidv4(),
    deleteRoles: uuidv4(),
    
    // Audit permissions
    viewAuditLogs: uuidv4(),
    exportAuditLogs: uuidv4(),
  };

  // Insert all permissions
  const permissionsValues = [
    [permissionIds.viewUsers, 'view:users', 'View users', 'user', 'read', true],
    [permissionIds.createUsers, 'create:users', 'Create users', 'user', 'create', true],
    [permissionIds.updateUsers, 'update:users', 'Update users', 'user', 'update', true],
    [permissionIds.deleteUsers, 'delete:users', 'Delete users', 'user', 'delete', true],
    
    [permissionIds.viewServers, 'view:servers', 'View SFTP servers', 'server', 'read', true],
    [permissionIds.createServers, 'create:servers', 'Create SFTP servers', 'server', 'create', true],
    [permissionIds.updateServers, 'update:servers', 'Update SFTP servers', 'server', 'update', true],
    [permissionIds.deleteServers, 'delete:servers', 'Delete SFTP servers', 'server', 'delete', true],
    
    [permissionIds.viewOrganization, 'view:organization', 'View organization', 'organization', 'read', true],
    [permissionIds.updateOrganization, 'update:organization', 'Update organization', 'organization', 'update', true],
    [permissionIds.manageSubscription, 'manage:subscription', 'Manage subscription', 'organization', 'billing', true],
    [permissionIds.manageCloudCredentials, 'manage:cloud_credentials', 'Manage cloud credentials', 'organization', 'credentials', true],
    
    [permissionIds.viewIdP, 'view:idp', 'View identity providers', 'identity_provider', 'read', true],
    [permissionIds.createIdP, 'create:idp', 'Create identity providers', 'identity_provider', 'create', true],
    [permissionIds.updateIdP, 'update:idp', 'Update identity providers', 'identity_provider', 'update', true],
    [permissionIds.deleteIdP, 'delete:idp', 'Delete identity providers', 'identity_provider', 'delete', true],
    
    [permissionIds.viewRoles, 'view:roles', 'View roles', 'role', 'read', true],
    [permissionIds.createRoles, 'create:roles', 'Create roles', 'role', 'create', true],
    [permissionIds.updateRoles, 'update:roles', 'Update roles', 'role', 'update', true],
    [permissionIds.deleteRoles, 'delete:roles', 'Delete roles', 'role', 'delete', true],
    
    [permissionIds.viewAuditLogs, 'view:audit_logs', 'View audit logs', 'audit', 'read', true],
    [permissionIds.exportAuditLogs, 'export:audit_logs', 'Export audit logs', 'audit', 'export', true],
  ];

  const permissionsQuery = `
    INSERT INTO permissions (id, name, description, resource_type, action, is_system_permission)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (name) DO NOTHING;
  `;

  for (const permission of permissionsValues) {
    await client.query(permissionsQuery, permission);
  }

  // Create system roles
  const adminRoleId = uuidv4();
  const userRoleId = uuidv4();
  const viewerRoleId = uuidv4();

  await client.query(`
    INSERT INTO roles (id, name, description, is_system_role)
    VALUES 
      ($1, 'System Administrator', 'Full system access', true),
      ($2, 'User', 'Standard user access', true),
      ($3, 'Viewer', 'Read-only access', true)
    ON CONFLICT (organization_id, name) DO NOTHING;
  `, [adminRoleId, userRoleId, viewerRoleId]);

  // Assign permissions to admin role
  for (const permId of Object.values(permissionIds)) {
    await client.query(`
      INSERT INTO role_permissions (role_id, permission_id)
      VALUES ($1, $2)
      ON CONFLICT (role_id, permission_id) DO NOTHING;
    `, [adminRoleId, permId]);
  }

  // Assign permissions to user role
  const userPermissions = [
    permissionIds.viewUsers,
    permissionIds.viewServers,
    permissionIds.createServers,
    permissionIds.updateServers,
    permissionIds.deleteServers,
    permissionIds.viewOrganization,
    permissionIds.viewIdP,
    permissionIds.viewRoles,
  ];

  for (const permId of userPermissions) {
    await client.query(`
      INSERT INTO role_permissions (role_id, permission_id)
      VALUES ($1, $2)
      ON CONFLICT (role_id, permission_id) DO NOTHING;
    `, [userRoleId, permId]);
  }

  // Assign permissions to viewer role
  const viewerPermissions = [
    permissionIds.viewUsers,
    permissionIds.viewServers,
    permissionIds.viewOrganization,
    permissionIds.viewIdP,
    permissionIds.viewRoles,
  ];

  for (const permId of viewerPermissions) {
    await client.query(`
      INSERT INTO role_permissions (role_id, permission_id)
      VALUES ($1, $2)
      ON CONFLICT (role_id, permission_id) DO NOTHING;
    `, [viewerRoleId, permId]);
  }

  // Create a demo organization if in development mode
  if (process.env.NODE_ENV === 'development') {
    const demoOrgId = uuidv4();
    const demoAdminId = uuidv4();
    const demoUserPassword = 'SafetyPin@Demo123'; // For development only
    const hashedPassword = await bcrypt.hash(demoUserPassword, 10);

    // Create demo organization
    await client.query(`
      INSERT INTO organizations (id, name, domain, subscription_tier, max_users)
      VALUES ($1, 'Demo Organization', 'demo.safetypin.cloud', 'pro', 10)
      ON CONFLICT (domain) DO NOTHING;
    `, [demoOrgId]);

    // Create demo admin user
    await client.query(`
      INSERT INTO users (id, email, first_name, last_name, job_title, password_hash, status)
      VALUES ($1, 'admin@demo.safetypin.cloud', 'Demo', 'Admin', 'Administrator', $2, 'active')
      ON CONFLICT (email) DO NOTHING;
    `, [demoAdminId, hashedPassword]);

    // Link user to organization
    await client.query(`
      INSERT INTO organization_users (organization_id, user_id, role, is_owner)
      VALUES ($1, $2, 'admin', true)
      ON CONFLICT (organization_id, user_id) DO NOTHING;
    `, [demoOrgId, demoAdminId]);

    // Assign admin role to the demo admin
    await client.query(`
      INSERT INTO user_roles (user_id, role_id, organization_id)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, role_id, organization_id) DO NOTHING;
    `, [demoAdminId, adminRoleId, demoOrgId]);

    // Add demo cloud credentials
    await client.query(`
      INSERT INTO organization_cloud_credentials (
        id, organization_id, cloud_provider_id, name, credential_type, credentials, 
        created_by, updated_by, status, is_default
      )
      VALUES (
        $1, $2, $3, 'Demo AWS Credentials', 'api_key', 
        '{"accessKeyId": "DEMO_ACCESS_KEY", "secretAccessKey": "DEMO_SECRET_KEY", "region": "us-west-2"}', 
        $4, $4, 'active', true
      )
      ON CONFLICT (organization_id, cloud_provider_id, name) DO NOTHING;
    `, [uuidv4(), demoOrgId, awsId, demoAdminId]);
  }

  // Insert this migration into the migrations table
  await client.query(`
    INSERT INTO migrations (name) VALUES ('002_seed_initial_data');
  `);
}

export async function down(client: PoolClient): Promise<void> {
  // This is a data migration, so down would remove the seeded data
  // Note: In production, you might want to be careful about removing data
  
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    // Remove demo data
    await client.query(`DELETE FROM organization_cloud_credentials WHERE name = 'Demo AWS Credentials';`);
    await client.query(`DELETE FROM user_roles WHERE user_id IN (SELECT id FROM users WHERE email = 'admin@demo.safetypin.cloud');`);
    await client.query(`DELETE FROM organization_users WHERE user_id IN (SELECT id FROM users WHERE email = 'admin@demo.safetypin.cloud');`);
    await client.query(`DELETE FROM users WHERE email = 'admin@demo.safetypin.cloud';`);
    await client.query(`DELETE FROM organizations WHERE domain = 'demo.safetypin.cloud';`);
  }
  
  // Clear system roles and permissions
  await client.query(`DELETE FROM role_permissions;`);
  await client.query(`DELETE FROM roles WHERE is_system_role = true;`);
  await client.query(`DELETE FROM permissions WHERE is_system_permission = true;`);
  await client.query(`DELETE FROM cloud_providers;`);
  
  // Remove the migration record
  await client.query(`DELETE FROM migrations WHERE name = '002_seed_initial_data';`);
}
