import { PoolClient } from 'pg';
import * as path from 'path';
import { transaction, initializeDbPool, closePool } from './config';

/**
 * Run the debug migration directly
 */
export async function runDebugMigration(): Promise<void> {
  console.log('Running debug migration directly...');
  
  try {
    // Initialize the database pool
    await initializeDbPool();
    
    // Load the debug migration
    const migrationPath = path.join(__dirname, 'migrations', '004_seed_server_transfer_data_debug');
    const migration = require(migrationPath);
    
    // Run the migration in a transaction
    await transaction(async (client: PoolClient) => {
      console.log('Executing debug migration up function');
      await migration.up(client);
      console.log('Debug migration completed');
    });
    
    console.log('Debug migration successfully applied');
  } catch (error) {
    console.error('Error executing debug migration:', error);
    throw error;
  } finally {
    // Close the database pool
    await closePool();
  }
}

// If this script is run directly
if (require.main === module) {
  runDebugMigration()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}
