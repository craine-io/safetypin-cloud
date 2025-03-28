import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import controllers
import { serverController } from './controllers/server.controller';
import { transferController } from './controllers/transfer.controller';
import { RepositoryFactory } from './lib/repositories';

// Load environment variables
dotenv.config();

// Initialize Express application
const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

// Middleware setup
app.use(helmet()); // Security headers
app.use(cors());   // CORS handling
app.use(express.json()); // Parse JSON request bodies
app.use(morgan('dev')); // Request logging

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Debug endpoints (add these at the top level)
app.get('/debug/servers', async (req, res) => {
  try {
    console.log('Debug servers endpoint called');
    const serverRepo = RepositoryFactory.getServerRepository();
    const servers = await serverRepo.findAll();
    console.log('Servers found:', servers.length);
    res.status(200).json({
      message: 'Debug endpoint working',
      serverCount: servers.length,
      servers: servers
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

app.get('/debug/migrations', async (req, res) => {
  try {
    console.log('Debug migrations endpoint called');
    const { query: dbQuery } = require('./lib/database/config');
    const result = await dbQuery('SELECT * FROM migrations ORDER BY id');
    console.log('Migrations found:', result.rows.length);
    res.status(200).json({
      message: 'Migrations debug info',
      migrations: result.rows
    });
  } catch (error) {
    console.error('Migrations debug endpoint error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Base route
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'SafetyPin API Server',
    version: '0.1.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Temporary test endpoint for frontend connection testing
app.get('/api/status', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'API is operational',
    timestamp: new Date().toISOString()
  });
});

// Server routes
app.get('/servers', (req, res) => serverController.getAllServers(req, res));
app.get('/servers/:id', (req, res) => serverController.getServerById(req, res));
app.post('/servers', (req, res) => serverController.createServer(req, res));
app.put('/servers/:id', (req, res) => serverController.updateServer(req, res));
app.delete('/servers/:id', (req, res) => serverController.deleteServer(req, res));
app.put('/servers/:id/status', (req, res) => serverController.updateServerStatus(req, res));
app.get('/organizations/:organizationId/servers', (req, res) => serverController.getServersByOrganization(req, res));

// Transfer routes
app.get('/transfers', (req, res) => transferController.getAllTransfers(req, res));
app.get('/transfers/:id', (req, res) => transferController.getTransferById(req, res));
app.post('/transfers', (req, res) => transferController.createTransfer(req, res));
app.put('/transfers/:id', (req, res) => transferController.updateTransfer(req, res));
app.put('/transfers/:id/status', (req, res) => transferController.updateTransferStatus(req, res));
app.get('/servers/:serverId/transfers', (req, res) => transferController.getTransfersByServer(req, res));
app.get('/transfer-stats', (req, res) => transferController.getTransferStats(req, res));

// Debug endpoint for servers
app.get('/api/debug/servers', async (req, res) => {
  try {
    const serverRepo = RepositoryFactory.getServerRepository();
    const servers = await serverRepo.findAll();
    res.status(200).json({
      message: 'Debug endpoint working',
      serverCount: servers.length,
      servers: servers
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Debug endpoint for migrations
app.get('/api/debug/migrations', async (req, res) => {
  try {
    const { query: dbQuery } = require('./lib/database/config');
    const result = await dbQuery('SELECT * FROM migrations ORDER BY id');
    res.status(200).json({
      message: 'Migrations debug info',
      migrations: result.rows
    });
  } catch (error) {
    console.error('Migrations debug endpoint error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message
  });
});

// Start the server
export const startServer = () => {
  return app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

export default app;
