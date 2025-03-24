import dotenv from 'dotenv';
import { initializeDbPool } from './lib/database/config';
import { migrateUp } from './lib/database/migrator';

// Load environment variables from .env file
dotenv.config();

// Initialize database connection
async function initialize() {
  try {
    // Initialize database pool
    await initializeDbPool();
    console.log('Database pool initialized successfully');
    
    // Run migrations if needed
    if (process.env.RUN_MIGRATIONS === 'true') {
      console.log('Running database migrations...');
      await migrateUp();
      console.log('Database migrations completed successfully');
    }
    
    // Start the application
    console.log(`SafetyPin backend initialized in ${process.env.NODE_ENV || 'development'} mode`);
  } catch (error) {
    console.error('Error initializing the application:', error);
    process.exit(1);
  }
}

// Initialize the application
initialize();
