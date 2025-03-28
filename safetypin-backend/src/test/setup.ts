// Global test setup for backend tests
import dotenv from 'dotenv';

// Load environment variables from .env.test file if it exists
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';

// Setup any global mocks or before/after handlers
beforeAll(async () => {
  // Add global setup like database connection for integration tests
  // Or set up global mocks
});

afterAll(async () => {
  // Clean up resources after all tests
});
