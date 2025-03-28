import { PoolClient } from 'pg';
import { v4 as uuidv4 } from 'uuid';

// Seed initial server and transfer data for development/testing
export async function up(client: PoolClient): Promise<void> {
  console.log('Running seed_server_transfer_data debug migration');
  
  try {
    // Check for existing organization, create one if none exists
    const orgCheckResult = await client.query(`SELECT id FROM organizations LIMIT 1`);
    let organizationId: string;
    
    if (orgCheckResult.rows.length === 0) {
      // Create a test organization if none exists
      organizationId = uuidv4();
      console.log('Creating test organization with ID:', organizationId);
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
      console.log('Using existing organization with ID:', organizationId);
    }

    // Create server data
    const server1Id = uuidv4();
    console.log('Creating server 1 with ID:', server1Id);

    // Insert server record
    await client.query(`
      INSERT INTO servers (
        id, organization_id, name, host, status, type, 
        storage_used, storage_limit, last_connection, region, username
      )
      VALUES (
        $1, $2, 'DEBUG Server One', 'sftp-debug-01.safetypin-oss.example.com', 'Online', 'SFTP', 
        50000000, 100000000, '5 minutes ago', 'us-east-1', 'sftp-user'
      )
    `, [server1Id, organizationId]);

    // Create sample transfer data
    const transferId = uuidv4();
    console.log('Creating transfer with ID:', transferId);
    await client.query(`
      INSERT INTO transfers (
        id, server_id, organization_id, filename, path, direction, 
        timestamp, size, status
      )
      VALUES (
        $1, $2, $3, 'debug-file.txt', '/uploads/debug-file.txt', 'upload',
        NOW() - INTERVAL '10 minutes', 1048576, 'completed'
      )
    `, [transferId, server1Id, organizationId]);

    // Add to migrations table
    await client.query(`
      INSERT INTO migrations (name) VALUES ('004_seed_server_transfer_data_debug');
    `);
    
    console.log('Debug migration completed successfully');
  } catch (error) {
    console.error('Error in debug migration:', error);
    throw error;
  }
}

export async function down(client: PoolClient): Promise<void> {
  // Delete test data
  console.log('Running down migration for seed_server_transfer_data_debug');
  await client.query(`DELETE FROM transfers WHERE filename = 'debug-file.txt'`);
  await client.query(`DELETE FROM servers WHERE name = 'DEBUG Server One'`);
  console.log('Debug data removed');
}
