import { PoolClient } from 'pg';
import { v4 as uuidv4 } from 'uuid';

// Seed initial server and transfer data for development/testing
export async function up(client: PoolClient): Promise<void> {
  // Check for existing organization, create one if none exists
  const orgCheckResult = await client.query(`SELECT id FROM organizations LIMIT 1`);
  let organizationId: string;
  
  if (orgCheckResult.rows.length === 0) {
    // Create a test organization if none exists
    organizationId = uuidv4();
    await client.query(`
      INSERT INTO organizations (
        id, name, domain, status, subscription_tier, max_users
      )
      VALUES (
        $1, 'Test Organization', 'example.com', 'active', 'pro', 50
      )
    `, [organizationId]);
  } else {
    organizationId = orgCheckResult.rows[0].id;
  }

  // Create server data
  const server1Id = uuidv4();
  const server2Id = uuidv4();
  const server3Id = uuidv4();
  const server4Id = uuidv4();

  // Insert server records
  await client.query(`
    INSERT INTO servers (
      id, organization_id, name, host, status, type, 
      storage_used, storage_limit, last_connection, region, username
    ) VALUES (
      $1, $2, 'DB Production Server', 'sftp-prod01.safetypin-oss.example.com', 'Online', 'SFTP', 
      91268055040, 107374182400, '10 minutes ago', 'us-east-1', 'sftp-user'
    )
  `, [server1Id, organizationId]);

  await client.query(`
    INSERT INTO servers (
      id, organization_id, name, host, status, type, 
      storage_used, storage_limit, last_connection, region, username
    ) VALUES (
      $1, $2, 'DB Development Server', 'sftp-dev01.safetypin-oss.example.com', 'Online', 'SFTP', 
      45097156608, 107374182400, '3 hours ago', 'us-west-1', 'sftp-user'
    )
  `, [server2Id, organizationId]);

  await client.query(`
    INSERT INTO servers (
      id, organization_id, name, host, status, type, 
      storage_used, storage_limit, last_connection, region, username
    ) VALUES (
      $1, $2, 'DB Testing Server', 'sftp-test01.safetypin-oss.example.com', 'Offline', 'SFTP', 
      0, 53687091200, '2 days ago', 'eu-west-1', 'sftp-user'
    )
  `, [server3Id, organizationId]);

  await client.query(`
    INSERT INTO servers (
      id, organization_id, name, host, status, type, 
      storage_used, storage_limit, last_connection, region, username
    ) VALUES (
      $1, $2, 'DB Backup Server', 'sftp-backup01.safetypin-oss.example.com', 'Online', 'SFTP', 
      71932420096, 107374182400, '5 hours ago', 'us-east-1', 'sftp-user'
    )
  `, [server4Id, organizationId]);

  // Create sample transfer data
  await client.query(`
    INSERT INTO transfers (
      id, server_id, organization_id, filename, path, direction, 
      timestamp, size, status
    ) VALUES (
      $1, $2, $3, 'db-quarterly-report-2025.pdf', '/uploads/db-quarterly-report-2025.pdf', 'upload',
      NOW() - INTERVAL '10 minutes', 4404019, 'completed'
    )
  `, [uuidv4(), server1Id, organizationId]);

  await client.query(`
    INSERT INTO transfers (
      id, server_id, organization_id, filename, path, direction, 
      timestamp, size, status
    ) VALUES (
      $1, $2, $3, 'db-customer-data.xlsx', '/downloads/db-customer-data.xlsx', 'download',
      NOW() - INTERVAL '25 minutes', 1887436, 'completed'
    )
  `, [uuidv4(), server2Id, organizationId]);

  await client.query(`
    INSERT INTO transfers (
      id, server_id, organization_id, filename, path, direction, 
      timestamp, size, status
    ) VALUES (
      $1, $2, $3, 'db-system-backup-2025.tar.gz', '/uploads/db-system-backup-2025.tar.gz', 'upload',
      NOW() - INTERVAL '1 hour', 268881920, 'completed'
    )
  `, [uuidv4(), server4Id, organizationId]);

  await client.query(`
    INSERT INTO transfers (
      id, server_id, organization_id, filename, path, direction, 
      timestamp, size, status
    ) VALUES (
      $1, $2, $3, 'db-employee-records.json', '/downloads/db-employee-records.json', 'download',
      NOW() - INTERVAL '3 hours', 800768, 'completed'
    )
  `, [uuidv4(), server1Id, organizationId]);

  await client.query(`
    INSERT INTO transfers (
      id, server_id, organization_id, filename, path, direction, 
      timestamp, size, status
    ) VALUES (
      $1, $2, $3, 'db-analytics-dataset.zip', '/uploads/db-analytics-dataset.zip', 'upload',
      NOW(), 1288490188, 'in-progress'
    )
  `, [uuidv4(), server1Id, organizationId]);

  // Add to migrations table
  await client.query(`
    INSERT INTO migrations (name) VALUES ('004_seed_server_transfer_data');
  `);
}

export async function down(client: PoolClient): Promise<void> {
  // Delete test data
  await client.query(`DELETE FROM transfers`);
  await client.query(`DELETE FROM servers`);
}
