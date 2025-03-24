import { Pool, PoolClient } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { query, transaction, initializeDbPool, closePool } from './config';

interface Migration {
  name: string;
  up: (client: PoolClient) => Promise<void>;
  down: (client: PoolClient) => Promise<void>;
}

export async function getMigrations(): Promise<Migration[]> {
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.ts') || file.endsWith('.js'))
    .sort();
  
  const migrations: Migration[] = [];
  
  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const migration = require(filePath);
    const name = file.replace(/\.[jt]s$/, '');
    
    migrations.push({
      name,
      up: migration.up,
      down: migration.down,
    });
  }
  
  return migrations;
}

export async function getAppliedMigrations(): Promise<string[]> {
  try {
    // Check if migrations table exists
    const tableExists = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'migrations'
      );
    `);
    
    if (!tableExists.rows[0].exists) {
      return [];
    }
    
    const result = await query('SELECT name FROM migrations ORDER BY id ASC');
    return result.rows.map((row: { name: string }) => row.name);
  } catch (error) {
    // If the table doesn't exist yet, return empty array
    return [];
  }
}

export async function migrateUp(): Promise<void> {
  console.log('Starting database migration (up)...');
  
  try {
    // Initialize the database pool
    await initializeDbPool();
    
    // Get all available migrations
    const migrations = await getMigrations();
    console.log(`Found ${migrations.length} migrations`);
    
    // Get applied migrations
    const appliedMigrations = await getAppliedMigrations();
    console.log(`${appliedMigrations.length} migrations already applied`);
    
    // Filter migrations that haven't been applied yet
    const pendingMigrations = migrations.filter(
      migration => !appliedMigrations.includes(migration.name)
    );
    
    if (pendingMigrations.length === 0) {
      console.log('No pending migrations. Database is up to date.');
      return;
    }
    
    console.log(`Applying ${pendingMigrations.length} pending migrations...`);
    
    // Apply each migration in a transaction
    for (const migration of pendingMigrations) {
      console.log(`Applying migration: ${migration.name}`);
      
      await transaction(async (client) => {
        await migration.up(client);
        
        // If migrations table doesn't exist yet, it will be created by the first migration
        // We don't need to track that migration separately
        if (migration.name !== '001_initial_schema') {
          await client.query(
            'INSERT INTO migrations (name) VALUES ($1)',
            [migration.name]
          );
        }
      });
      
      console.log(`Migration applied: ${migration.name}`);
    }
    
    console.log('Database migration completed successfully.');
  } catch (error) {
    console.error('Error during database migration:', error);
    throw error;
  } finally {
    // Close the database pool
    await closePool();
  }
}

export async function migrateDown(targetMigration?: string): Promise<void> {
  console.log(`Starting database migration (down)${targetMigration ? ` to ${targetMigration}` : ' all'}`);
  
  try {
    // Initialize the database pool
    await initializeDbPool();
    
    // Get all available migrations
    const migrations = await getMigrations();
    
    // Get applied migrations
    const appliedMigrations = await getAppliedMigrations();
    
    // Reverse the order for down migrations
    const migrationsToRevert = migrations
      .filter(migration => appliedMigrations.includes(migration.name))
      .reverse();
    
    if (migrationsToRevert.length === 0) {
      console.log('No migrations to revert.');
      return;
    }
    
    // If targetMigration is specified, only revert until we reach it
    const targetIndex = targetMigration 
      ? migrationsToRevert.findIndex(m => m.name === targetMigration)
      : migrationsToRevert.length - 1;
    
    if (targetMigration && targetIndex === -1) {
      throw new Error(`Target migration "${targetMigration}" not found or not applied.`);
    }
    
    // Revert each migration in a transaction
    for (let i = 0; i <= targetIndex; i++) {
      const migration = migrationsToRevert[i];
      console.log(`Reverting migration: ${migration.name}`);
      
      await transaction(async (client) => {
        await migration.down(client);
        
        // Remove from migrations table
        await client.query(
          'DELETE FROM migrations WHERE name = $1',
          [migration.name]
        );
      });
      
      console.log(`Migration reverted: ${migration.name}`);
    }
    
    console.log('Database migration (down) completed successfully.');
  } catch (error) {
    console.error('Error during database migration (down):', error);
    throw error;
  } finally {
    // Close the database pool
    await closePool();
  }
}

// If this script is run directly
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  const target = args[1];
  
  if (command === 'up') {
    migrateUp()
      .then(() => process.exit(0))
      .catch(err => {
        console.error(err);
        process.exit(1);
      });
  } else if (command === 'down') {
    migrateDown(target)
      .then(() => process.exit(0))
      .catch(err => {
        console.error(err);
        process.exit(1);
      });
  } else {
    console.log('Usage: node migrator.js up|down [target-migration]');
    process.exit(1);
  }
}
