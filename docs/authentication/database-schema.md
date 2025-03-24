# SafetyPin OSS Authentication Database Schema

This document outlines the database schema design for the SafetyPin OSS authentication system, with specific focus on supporting Enterprise SSO integration and multi-cloud capabilities.

## Core Authentication Entities

### Users Table

Stores the core user identity information across all authentication methods.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    job_title VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- active, inactive, suspended, deleted
    creation_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_time TIMESTAMP,
    password_hash VARCHAR(255), -- Only stored for local authentication
    password_last_changed TIMESTAMP,
    force_password_change BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    phone_number VARCHAR(20),
    timezone VARCHAR(50) DEFAULT 'UTC',
    locale VARCHAR(10) DEFAULT 'en-US',
    mfa_enabled BOOLEAN DEFAULT FALSE
);
```

### Organizations Table

Represents a tenant in a multi-tenant system, essential for Enterprise SSO.

```sql
CREATE TABLE organizations (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE, -- For auto-association of email domains
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- active, inactive, suspended, deleted
    creation_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    subscription_tier VARCHAR(50) NOT NULL DEFAULT 'free',
    max_users INTEGER DEFAULT 5,
    billing_email VARCHAR(255),
    technical_contact_email VARCHAR(255),
    settings JSONB -- Organization-wide settings
);
```

### Organization_Users Table

Maps users to organizations with role information.

```sql
CREATE TABLE organization_users (
    organization_id UUID REFERENCES organizations(id),
    user_id UUID REFERENCES users(id),
    role VARCHAR(50) NOT NULL DEFAULT 'user', -- owner, admin, user, etc.
    is_owner BOOLEAN DEFAULT FALSE,
    creation_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (organization_id, user_id)
);
```

## SSO Configuration

### Identity_Providers Table

Configures enterprise identity providers for SSO.

```sql
CREATE TABLE identity_providers (
    id UUID PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- saml, oidc, azure_ad, google, okta, etc.
    issuer_url TEXT,
    entity_id TEXT, -- For SAML
    metadata_url TEXT, -- For SAML
    client_id TEXT, -- For OIDC
    client_secret TEXT, -- Encrypted, for OIDC
    discovery_url TEXT, -- For OIDC
    certificate TEXT, -- Public certificate for verification
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- active, inactive, configured
    creation_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_default BOOLEAN DEFAULT FALSE, -- Is this the default IdP for the org
    configuration JSONB -- Provider-specific configuration
);
```

### Identity_Provider_Mappings Table

Maps external identity provider user IDs to internal user IDs.

```sql
CREATE TABLE identity_provider_mappings (
    id UUID PRIMARY KEY,
    identity_provider_id UUID REFERENCES identity_providers(id),
    external_id VARCHAR(255) NOT NULL, -- ID from the external provider
    user_id UUID REFERENCES users(id),
    email VARCHAR(255) NOT NULL,
    creation_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_time TIMESTAMP,
    external_attributes JSONB, -- Attributes from the external provider
    UNIQUE (identity_provider_id, external_id)
);
```

## Multi-Factor Authentication

### MFA_Methods Table

Configures available MFA methods.

```sql
CREATE TABLE mfa_methods (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    type VARCHAR(50) NOT NULL, -- totp, sms, email, push, recovery_codes
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- active, inactive, pending
    creation_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_used_time TIMESTAMP,
    secret TEXT, -- Encrypted secret for TOTP
    phone_number VARCHAR(20), -- For SMS
    device_token TEXT, -- For push notifications
    backup_codes JSONB, -- Encrypted backup codes
    UNIQUE (user_id, type)
);
```

### MFA_Sessions Table

Tracks MFA verification status for active sessions.

```sql
CREATE TABLE mfa_sessions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    session_id UUID NOT NULL, -- Reference to the user's session
    method_id UUID REFERENCES mfa_methods(id),
    status VARCHAR(20) NOT NULL, -- pending, completed, expired, failed
    creation_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiration_time TIMESTAMP NOT NULL,
    verification_time TIMESTAMP,
    challenge_id VARCHAR(255), -- ID for the challenge sent to the user
    attempt_count INTEGER DEFAULT 0
);
```

## Session Management

### Sessions Table

Tracks user authentication sessions.

```sql
CREATE TABLE sessions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    creation_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiration_time TIMESTAMP NOT NULL,
    last_activity_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_id VARCHAR(255),
    refresh_token_id UUID, -- If using refresh tokens
    is_mfa_complete BOOLEAN DEFAULT FALSE,
    revoked BOOLEAN DEFAULT FALSE,
    revocation_reason VARCHAR(100),
    session_data JSONB -- Additional session metadata
);
```

### Refresh_Tokens Table

For implementing OAuth2 refresh token functionality.

```sql
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    token_hash VARCHAR(255) NOT NULL, -- Hashed token value
    creation_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiration_time TIMESTAMP NOT NULL,
    used_time TIMESTAMP,
    is_used BOOLEAN DEFAULT FALSE,
    is_revoked BOOLEAN DEFAULT FALSE,
    client_id VARCHAR(255), -- OAuth client that requested the token
    scope TEXT -- OAuth scopes
);
```

## HIPAA Compliance Audit Logging

### Auth_Audit_Logs Table

Comprehensive audit logging for authentication events.

```sql
CREATE TABLE auth_audit_logs (
    id UUID PRIMARY KEY,
    event_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    event_type VARCHAR(50) NOT NULL, -- login, logout, failed_login, password_change, etc.
    user_id UUID REFERENCES users(id),
    acting_user_id UUID REFERENCES users(id), -- If action performed by admin
    organization_id UUID REFERENCES organizations(id),
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_id VARCHAR(255),
    result VARCHAR(20) NOT NULL, -- success, failure
    failure_reason TEXT,
    resource_type VARCHAR(50), -- The type of resource being accessed
    resource_id VARCHAR(255), -- The ID of the resource being accessed
    additional_data JSONB -- Any additional event-specific data
);
```

### Access_Attempt_Logs Table

Tracks failed login attempts for security monitoring.

```sql
CREATE TABLE access_attempt_logs (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id), -- Can be NULL if user doesn't exist
    email VARCHAR(255), -- The email that was attempted
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    attempt_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    result VARCHAR(20) NOT NULL, -- success, invalid_password, user_not_found, etc.
    identity_provider_id UUID REFERENCES identity_providers(id), -- If SSO
    additional_data JSONB
);
```

## Role-Based Access Control

### Roles Table

Defines system roles for access control.

```sql
CREATE TABLE roles (
    id UUID PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id), -- NULL for system roles
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE, -- System-defined vs custom role
    creation_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    last_update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id),
    UNIQUE (organization_id, name)
);
```

### Permissions Table

Defines individual permissions that can be granted.

```sql
CREATE TABLE permissions (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    resource_type VARCHAR(50) NOT NULL, -- server, user, organization, etc.
    action VARCHAR(50) NOT NULL, -- create, read, update, delete, etc.
    is_system_permission BOOLEAN DEFAULT TRUE
);
```

### Role_Permissions Table

Maps permissions to roles.

```sql
CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id),
    permission_id UUID REFERENCES permissions(id),
    PRIMARY KEY (role_id, permission_id)
);
```

### User_Roles Table

Assigns roles directly to users (in addition to org roles).

```sql
CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id),
    role_id UUID REFERENCES roles(id),
    organization_id UUID REFERENCES organizations(id),
    granted_by UUID REFERENCES users(id),
    granted_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id, organization_id)
);
```

## Multi-Cloud Integration

### Cloud_Providers Table

Defines supported cloud providers.

```sql
CREATE TABLE cloud_providers (
    id UUID PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE, -- aws, azure, gcp
    display_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- active, inactive, deprecated
    api_version VARCHAR(50),
    capabilities JSONB -- Features supported by this provider
);
```

### Organization_Cloud_Credentials Table

Stores cloud provider credentials for organizations.

```sql
CREATE TABLE organization_cloud_credentials (
    id UUID PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) NOT NULL,
    cloud_provider_id UUID REFERENCES cloud_providers(id) NOT NULL,
    name VARCHAR(255) NOT NULL, -- User-friendly name
    credential_type VARCHAR(50) NOT NULL, -- api_key, service_principal, etc.
    credentials JSONB NOT NULL, -- Encrypted credentials
    creation_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    last_update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id),
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- active, inactive, error
    last_verified_time TIMESTAMP,
    is_default BOOLEAN DEFAULT FALSE, -- Default credentials for this provider
    UNIQUE (organization_id, cloud_provider_id, name)
);
```

## Index Recommendations

```sql
-- User lookup indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);

-- Organization indexes
CREATE INDEX idx_organizations_domain ON organizations(domain);
CREATE INDEX idx_organizations_status ON organizations(status);

-- Identity provider indexes
CREATE INDEX idx_identity_providers_org_id ON identity_providers(organization_id);
CREATE INDEX idx_identity_providers_type ON identity_providers(type);

-- Identity mapping lookup
CREATE INDEX idx_identity_mappings_user_id ON identity_provider_mappings(user_id);
CREATE INDEX idx_identity_mappings_email ON identity_provider_mappings(email);

-- MFA indexes
CREATE INDEX idx_mfa_methods_user_id ON mfa_methods(user_id);
CREATE INDEX idx_mfa_sessions_user_id ON mfa_sessions(user_id);
CREATE INDEX idx_mfa_sessions_session_id ON mfa_sessions(session_id);

-- Session management
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expiration ON sessions(expiration_time);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);

-- Audit logging indexes
CREATE INDEX idx_auth_audit_logs_user_id ON auth_audit_logs(user_id);
CREATE INDEX idx_auth_audit_logs_event_time ON auth_audit_logs(event_time);
CREATE INDEX idx_auth_audit_logs_event_type ON auth_audit_logs(event_type);
CREATE INDEX idx_access_attempt_logs_ip ON access_attempt_logs(ip_address);
CREATE INDEX idx_access_attempt_logs_email ON access_attempt_logs(email);

-- RBAC indexes
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);

-- Multi-cloud indexes
CREATE INDEX idx_org_cloud_credentials_org_id ON organization_cloud_credentials(organization_id);
CREATE INDEX idx_org_cloud_credentials_provider_id ON organization_cloud_credentials(cloud_provider_id);
```

## Schema Notes and Considerations

1. **Encryption**: Fields containing sensitive data (credentials, secrets) should be encrypted at rest. Consider using a dedicated encryption service or database column-level encryption.

2. **JSON Data**: The JSONB type is used for flexible, schema-less data. This allows for provider-specific fields without schema changes.

3. **UUIDs**: Using UUIDs instead of sequential IDs provides better security and simplifies data distribution/sharding if needed later.

4. **Multi-Tenancy**: The schema is designed for multi-tenant operations with organization isolation.

5. **Audit Trail**: Comprehensive audit logging is included for HIPAA compliance.

6. **Cloud Agnostic**: The design separates authentication concerns from cloud-specific implementation details.

7. **Timestamps**: All tables include creation and update timestamps for auditability.

8. **Soft Deletion**: Status fields are used instead of hard deletion to maintain audit history.

This schema provides a solid foundation for implementing Enterprise SSO with MFA while supporting multi-cloud SFTP server management. It's designed to be compliant with HIPAA requirements for authentication and auditing.
