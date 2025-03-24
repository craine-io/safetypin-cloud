import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

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
