import { PoolClient } from 'pg';

// Initial database schema creation based on the schema.md document
export async function up(client: PoolClient): Promise<void> {
  // Create extension for UUID generation
  await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
  
  // Create extension for encryption functions
  await client.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

  // Create users table
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email VARCHAR(255) UNIQUE NOT NULL,
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      job_title VARCHAR(100),
      status VARCHAR(20) NOT NULL DEFAULT 'active',
      creation_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      last_update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      last_login_time TIMESTAMP,
      password_hash VARCHAR(255),
      password_last_changed TIMESTAMP,
      force_password_change BOOLEAN DEFAULT FALSE,
      avatar_url TEXT,
      phone_number VARCHAR(20),
      timezone VARCHAR(50) DEFAULT 'UTC',
      locale VARCHAR(10) DEFAULT 'en-US',
      mfa_enabled BOOLEAN DEFAULT FALSE
    );
  `);

  // Create organizations table
  await client.query(`
    CREATE TABLE IF NOT EXISTS organizations (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(255) NOT NULL,
      domain VARCHAR(255) UNIQUE,
      status VARCHAR(20) NOT NULL DEFAULT 'active',
      creation_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      subscription_tier VARCHAR(50) NOT NULL DEFAULT 'free',
      max_users INTEGER DEFAULT 5,
      billing_email VARCHAR(255),
      technical_contact_email VARCHAR(255),
      settings JSONB
    );
  `);

  // Create organization_users table
  await client.query(`
    CREATE TABLE IF NOT EXISTS organization_users (
      organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      role VARCHAR(50) NOT NULL DEFAULT 'user',
      is_owner BOOLEAN DEFAULT FALSE,
      creation_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (organization_id, user_id)
    );
  `);

  // Create identity_providers table
  await client.query(`
    CREATE TABLE IF NOT EXISTS identity_providers (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      type VARCHAR(50) NOT NULL,
      issuer_url TEXT,
      entity_id TEXT,
      metadata_url TEXT,
      client_id TEXT,
      client_secret TEXT,
      discovery_url TEXT,
      certificate TEXT,
      status VARCHAR(20) NOT NULL DEFAULT 'active',
      creation_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      last_update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      is_default BOOLEAN DEFAULT FALSE,
      configuration JSONB
    );
  `);

  // Create identity_provider_mappings table
  await client.query(`
    CREATE TABLE IF NOT EXISTS identity_provider_mappings (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      identity_provider_id UUID REFERENCES identity_providers(id) ON DELETE CASCADE,
      external_id VARCHAR(255) NOT NULL,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      email VARCHAR(255) NOT NULL,
      creation_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      last_login_time TIMESTAMP,
      external_attributes JSONB,
      UNIQUE (identity_provider_id, external_id)
    );
  `);

  // Create mfa_methods table
  await client.query(`
    CREATE TABLE IF NOT EXISTS mfa_methods (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      type VARCHAR(50) NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'active',
      creation_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      last_update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      last_used_time TIMESTAMP,
      secret TEXT,
      phone_number VARCHAR(20),
      device_token TEXT,
      backup_codes JSONB,
      UNIQUE (user_id, type)
    );
  `);

  // Create sessions table
  await client.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
      creation_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      expiration_time TIMESTAMP NOT NULL,
      last_activity_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      ip_address VARCHAR(45),
      user_agent TEXT,
      device_id VARCHAR(255),
      refresh_token_id UUID,
      is_mfa_complete BOOLEAN DEFAULT FALSE,
      revoked BOOLEAN DEFAULT FALSE,
      revocation_reason VARCHAR(100),
      session_data JSONB
    );
  `);

  // Create mfa_sessions table
  await client.query(`
    CREATE TABLE IF NOT EXISTS mfa_sessions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
      session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
      method_id UUID REFERENCES mfa_methods(id) ON DELETE SET NULL,
      status VARCHAR(20) NOT NULL,
      creation_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      expiration_time TIMESTAMP NOT NULL,
      verification_time TIMESTAMP,
      challenge_id VARCHAR(255),
      attempt_count INTEGER DEFAULT 0
    );
  `);

  // Create refresh_tokens table
  await client.query(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
      token_hash VARCHAR(255) NOT NULL,
      creation_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      expiration_time TIMESTAMP NOT NULL,
      used_time TIMESTAMP,
      is_used BOOLEAN DEFAULT FALSE,
      is_revoked BOOLEAN DEFAULT FALSE,
      client_id VARCHAR(255),
      scope TEXT
    );
  `);

  // Create auth_audit_logs table
  await client.query(`
    CREATE TABLE IF NOT EXISTS auth_audit_logs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      event_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      event_type VARCHAR(50) NOT NULL,
      user_id UUID REFERENCES users(id) ON DELETE SET NULL,
      acting_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
      organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
      ip_address VARCHAR(45),
      user_agent TEXT,
      device_id VARCHAR(255),
      result VARCHAR(20) NOT NULL,
      failure_reason TEXT,
      resource_type VARCHAR(50),
      resource_id VARCHAR(255),
      additional_data JSONB
    );
  `);

  // Create access_attempt_logs table
  await client.query(`
    CREATE TABLE IF NOT EXISTS access_attempt_logs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES users(id) ON DELETE SET NULL,
      email VARCHAR(255),
      ip_address VARCHAR(45) NOT NULL,
      user_agent TEXT,
      attempt_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      result VARCHAR(20) NOT NULL,
      identity_provider_id UUID REFERENCES identity_providers(id) ON DELETE SET NULL,
      additional_data JSONB
    );
  `);

  // Create roles table
  await client.query(`
    CREATE TABLE IF NOT EXISTS roles (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      is_system_role BOOLEAN DEFAULT FALSE,
      creation_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      created_by UUID REFERENCES users(id) ON DELETE SET NULL,
      last_update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
      UNIQUE (organization_id, name)
    );
  `);

  // Create permissions table
  await client.query(`
    CREATE TABLE IF NOT EXISTS permissions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL UNIQUE,
      description TEXT,
      resource_type VARCHAR(50) NOT NULL,
      action VARCHAR(50) NOT NULL,
      is_system_permission BOOLEAN DEFAULT TRUE
    );
  `);

  // Create role_permissions table
  await client.query(`
    CREATE TABLE IF NOT EXISTS role_permissions (
      role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
      permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
      PRIMARY KEY (role_id, permission_id)
    );
  `);

  // Create user_roles table
  await client.query(`
    CREATE TABLE IF NOT EXISTS user_roles (
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
      organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
      granted_by UUID REFERENCES users(id) ON DELETE SET NULL,
      granted_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, role_id, organization_id)
    );
  `);

  // Create cloud_providers table
  await client.query(`
    CREATE TABLE IF NOT EXISTS cloud_providers (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(50) NOT NULL UNIQUE,
      display_name VARCHAR(100) NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'active',
      api_version VARCHAR(50),
      capabilities JSONB
    );
  `);

  // Create organization_cloud_credentials table
  await client.query(`
    CREATE TABLE IF NOT EXISTS organization_cloud_credentials (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
      cloud_provider_id UUID REFERENCES cloud_providers(id) ON DELETE CASCADE NOT NULL,
      name VARCHAR(255) NOT NULL,
      credential_type VARCHAR(50) NOT NULL,
      credentials JSONB NOT NULL,
      creation_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      created_by UUID REFERENCES users(id) ON DELETE SET NULL,
      last_update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'active',
      last_verified_time TIMESTAMP,
      is_default BOOLEAN DEFAULT FALSE,
      UNIQUE (organization_id, cloud_provider_id, name)
    );
  `);

  // Create indices from schema recommendations
  await client.query(`
    -- User lookup indexes
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

    -- Organization indexes
    CREATE INDEX IF NOT EXISTS idx_organizations_domain ON organizations(domain);
    CREATE INDEX IF NOT EXISTS idx_organizations_status ON organizations(status);

    -- Identity provider indexes
    CREATE INDEX IF NOT EXISTS idx_identity_providers_org_id ON identity_providers(organization_id);
    CREATE INDEX IF NOT EXISTS idx_identity_providers_type ON identity_providers(type);

    -- Identity mapping lookup
    CREATE INDEX IF NOT EXISTS idx_identity_mappings_user_id ON identity_provider_mappings(user_id);
    CREATE INDEX IF NOT EXISTS idx_identity_mappings_email ON identity_provider_mappings(email);

    -- MFA indexes
    CREATE INDEX IF NOT EXISTS idx_mfa_methods_user_id ON mfa_methods(user_id);
    CREATE INDEX IF NOT EXISTS idx_mfa_sessions_user_id ON mfa_sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_mfa_sessions_session_id ON mfa_sessions(session_id);

    -- Session management
    CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_expiration ON sessions(expiration_time);
    CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);

    -- Audit logging indexes
    CREATE INDEX IF NOT EXISTS idx_auth_audit_logs_user_id ON auth_audit_logs(user_id);
    CREATE INDEX IF NOT EXISTS idx_auth_audit_logs_event_time ON auth_audit_logs(event_time);
    CREATE INDEX IF NOT EXISTS idx_auth_audit_logs_event_type ON auth_audit_logs(event_type);
    CREATE INDEX IF NOT EXISTS idx_access_attempt_logs_ip ON access_attempt_logs(ip_address);
    CREATE INDEX IF NOT EXISTS idx_access_attempt_logs_email ON access_attempt_logs(email);

    -- RBAC indexes
    CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
    CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);

    -- Multi-cloud indexes
    CREATE INDEX IF NOT EXISTS idx_org_cloud_credentials_org_id ON organization_cloud_credentials(organization_id);
    CREATE INDEX IF NOT EXISTS idx_org_cloud_credentials_provider_id ON organization_cloud_credentials(cloud_provider_id);
  `);

  // Create a table to track migrations
  await client.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Insert this migration into the migrations table
  await client.query(`
    INSERT INTO migrations (name) VALUES ('001_initial_schema');
  `);
}

export async function down(client: PoolClient): Promise<void> {
  // Drop all tables in reverse order of creation to respect foreign keys
  await client.query(`
    DROP TABLE IF EXISTS migrations;
    DROP TABLE IF EXISTS organization_cloud_credentials;
    DROP TABLE IF EXISTS cloud_providers;
    DROP TABLE IF EXISTS user_roles;
    DROP TABLE IF EXISTS role_permissions;
    DROP TABLE IF EXISTS permissions;
    DROP TABLE IF EXISTS roles;
    DROP TABLE IF EXISTS access_attempt_logs;
    DROP TABLE IF EXISTS auth_audit_logs;
    DROP TABLE IF EXISTS refresh_tokens;
    DROP TABLE IF EXISTS mfa_sessions;
    DROP TABLE IF EXISTS sessions;
    DROP TABLE IF EXISTS mfa_methods;
    DROP TABLE IF EXISTS identity_provider_mappings;
    DROP TABLE IF EXISTS identity_providers;
    DROP TABLE IF EXISTS organization_users;
    DROP TABLE IF EXISTS organizations;
    DROP TABLE IF EXISTS users;
  `);

  // Drop extensions
  await client.query(`
    DROP EXTENSION IF EXISTS pgcrypto;
    DROP EXTENSION IF EXISTS uuid-ossp;
  `);
}
