import { Pool, PoolConfig, PoolClient } from 'pg';
import * as AWS from 'aws-sdk';

// Environment-specific configuration
const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

// If running in AWS Lambda, we can use the AWS SDK to get the database credentials
const getAWSSecretValue = async (secretName: string): Promise<any> => {
  const secretsManager = new AWS.SecretsManager();
  const data = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
  if (data.SecretString) {
    return JSON.parse(data.SecretString);
  }
  throw new Error('Secret value not found');
};

// Database configuration based on environment
export const getDbConfig = async (): Promise<PoolConfig> => {
  // Default configuration for local development
  let config: PoolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'safetypin',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    ssl: isProduction ? { rejectUnauthorized: false } : false,
    max: parseInt(process.env.DB_POOL_SIZE || '10', 10),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };

  // In production, get credentials from AWS Secrets Manager
  if (isProduction && process.env.DB_SECRETS_NAME) {
    try {
      const secretData = await getAWSSecretValue(process.env.DB_SECRETS_NAME);
      config = {
        ...config,
        host: secretData.host,
        port: secretData.port,
        database: secretData.dbname,
        user: secretData.username,
        password: secretData.password,
      };
    } catch (error) {
      console.error('Error retrieving database credentials from Secrets Manager', error);
      throw error;
    }
  }

  // For testing, use a different database
  if (isTest) {
    config.database = 'safetypin_test';
  }

  return config;
};

// Create a pool to manage database connections
let pool: Pool | undefined;

export const initializeDbPool = async (): Promise<Pool> => {
  if (!pool) {
    const config = await getDbConfig();
    pool = new Pool(config);
    
    // Add error handler to the pool
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });
  }
  return pool;
};

// Get a client from the pool
export const getClient = async (): Promise<PoolClient> => {
  if (!pool) {
    await initializeDbPool();
  }
  // Non-null assertion since we know pool exists after initializeDbPool
  return pool!.connect();
};

// Execute a query and release the client back to the pool
export const query = async (text: string, params: any[] = []): Promise<any> => {
  if (!pool) {
    await initializeDbPool();
  }
  const start = Date.now();
  // Non-null assertion since we know pool exists after initializeDbPool
  const res = await pool!.query(text, params);
  const duration = Date.now() - start;
  
  // Log queries that take longer than 500ms
  if (duration > 500) {
    console.log('Long running query:', { text, params, duration, rows: res.rowCount });
  }
  
  return res;
};

// Transactional query execution
export const transaction = async <T>(callback: (client: PoolClient) => Promise<T>): Promise<T> => {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

// Close the pool
export const closePool = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
};
