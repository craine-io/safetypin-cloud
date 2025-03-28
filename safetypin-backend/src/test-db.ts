// Simple script to test database access
import { initializeDbPool, query, closePool } from './lib/database/config';
import { RepositoryFactory } from './lib/repositories';

async function testDatabase() {
  try {
    console.log('Initializing database connection...');
    await initializeDbPool();
    
    // Test a simple query
    const testResult = await query('SELECT NOW() as time');
    console.log('Database is working. Current time:', testResult.rows[0].time);
    
    // Test migrations table
    try {
      const migrationsResult = await query('SELECT COUNT(*) as count FROM migrations');
      console.log('Migrations table exists with', migrationsResult.rows[0].count, 'rows');
      
      const migrationsList = await query('SELECT id, name, applied_at FROM migrations ORDER BY id');
      console.log('Migrations:', migrationsList.rows);
    } catch (error) {
      console.error('Error checking migrations table:', error);
    }
    
    // Test server repository
    try {
      const serverRepo = RepositoryFactory.getServerRepository();
      const servers = await serverRepo.findAll();
      console.log('Found', servers.length, 'servers:');
      servers.forEach(server => {
        console.log('- Server:', server.id, server.name, server.host, server.status);
      });
    } catch (error) {
      console.error('Error using server repository:', error);
    }
    
    console.log('Database tests completed');
  } catch (error) {
    console.error('Database test error:', error);
  } finally {
    await closePool();
  }
}

// Run the test
testDatabase().then(() => {
  console.log('Test script finished');
  process.exit(0);
}).catch(error => {
  console.error('Test script failed:', error);
  process.exit(1);
});
