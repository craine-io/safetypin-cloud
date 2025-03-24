import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { initializeDbPool } from './lib/database/config';
import { migrateUp } from './lib/database/migrator';

// Load environment variables from .env file
dotenv.config();

// Create Express application
const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

// Basic middleware setup
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Base route
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'SafetyPin API Server',
    version: '0.1.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test endpoint for frontend connection testing
app.get('/api/status', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'API is operational',
    timestamp: new Date().toISOString()
  });
});

// Start the server first, then try to initialize database
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Health check available at http://localhost:${port}/health`);
  console.log(`API status available at http://localhost:${port}/api/status`);
  
  // Initialize database in the background
  initializeDatabase();
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message
  });
});

// Process error handlers
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Log the error but keep the process alive
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Log the error but keep the process alive
});

// Database initialization function
async function initializeDatabase() {
  try {
    console.log('Attempting to initialize database connection...');
    
    // Initialize database pool
    await initializeDbPool();
    console.log('Database pool initialized successfully');
    
    // Run migrations if needed
    if (process.env.RUN_MIGRATIONS === 'true') {
      console.log('Running database migrations...');
      try {
        await migrateUp();
        console.log('Database migrations completed successfully');
      } catch (migrationError) {
        console.error('Migration error:', migrationError);
        console.log('Continuing without migrations...');
      }
    }
    
    console.log(`SafetyPin backend fully initialized in ${process.env.NODE_ENV || 'development'} mode`);
  } catch (error) {
    console.error('Error initializing database connection:', error);
    console.log('API server will continue to run without database connectivity');
  }
}
