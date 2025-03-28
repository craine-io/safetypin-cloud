import { PoolClient } from 'pg';

// Migration for adding server and transfer tables
export async function up(client: PoolClient): Promise<void> {
  // Create servers table
  await client.query(`
    CREATE TABLE IF NOT EXISTS servers (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
      name VARCHAR(255) NOT NULL,
      host VARCHAR(255) NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'Provisioning',
      type VARCHAR(20) NOT NULL DEFAULT 'SFTP',
      storage_used BIGINT DEFAULT 0,
      storage_limit BIGINT NOT NULL,
      last_connection VARCHAR(255) DEFAULT 'Never',
      region VARCHAR(50) NOT NULL,
      username VARCHAR(100) NOT NULL,
      creation_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      last_update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      expiry_time TIMESTAMP,
      lifecycle_status VARCHAR(20),
      security_settings JSONB,
      lifecycle_settings JSONB,
      cloud_provider_id UUID REFERENCES cloud_providers(id) ON DELETE SET NULL,
      cloud_credential_id UUID REFERENCES organization_cloud_credentials(id) ON DELETE SET NULL,
      cloud_resource_id VARCHAR(255),
      created_by UUID REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  // Create server_credentials table for storing access credentials securely
  await client.query(`
    CREATE TABLE IF NOT EXISTS server_credentials (
      server_id UUID PRIMARY KEY REFERENCES servers(id) ON DELETE CASCADE,
      key_type VARCHAR(20) NOT NULL,
      public_key TEXT,
      private_key TEXT,
      passphrase TEXT,
      creation_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      last_update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create transfers table
  await client.query(`
    CREATE TABLE IF NOT EXISTS transfers (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      server_id UUID REFERENCES servers(id) ON DELETE CASCADE NOT NULL,
      organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
      filename VARCHAR(255) NOT NULL,
      path TEXT NOT NULL,
      direction VARCHAR(10) NOT NULL,
      timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      size BIGINT NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'in-progress',
      user_id UUID REFERENCES users(id) ON DELETE SET NULL,
      client_ip VARCHAR(45),
      transfer_time INTEGER,
      checksum_before VARCHAR(255),
      checksum_after VARCHAR(255),
      error_details TEXT
    );
  `);

  // Create indices
  await client.query(`
    -- Server lookup indexes
    CREATE INDEX IF NOT EXISTS idx_servers_organization_id ON servers(organization_id);
    CREATE INDEX IF NOT EXISTS idx_servers_status ON servers(status);
    CREATE INDEX IF NOT EXISTS idx_servers_region ON servers(region);
    CREATE INDEX IF NOT EXISTS idx_servers_expiry_time ON servers(expiry_time);
    
    -- Transfer lookup indexes
    CREATE INDEX IF NOT EXISTS idx_transfers_server_id ON transfers(server_id);
    CREATE INDEX IF NOT EXISTS idx_transfers_organization_id ON transfers(organization_id);
    CREATE INDEX IF NOT EXISTS idx_transfers_user_id ON transfers(user_id);
    CREATE INDEX IF NOT EXISTS idx_transfers_timestamp ON transfers(timestamp);
    CREATE INDEX IF NOT EXISTS idx_transfers_status ON transfers(status);
    CREATE INDEX IF NOT EXISTS idx_transfers_direction ON transfers(direction);
  `);

  // Add to migrations table
  await client.query(`
    INSERT INTO migrations (name) VALUES ('003_servers_transfers_schema');
  `);
}

export async function down(client: PoolClient): Promise<void> {
  // Drop all tables in reverse order of creation
  await client.query(`
    DROP TABLE IF EXISTS transfers;
    DROP TABLE IF EXISTS server_credentials;
    DROP TABLE IF EXISTS servers;
  `);
}
