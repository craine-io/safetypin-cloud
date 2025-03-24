import * as AWS from 'aws-sdk';
import * as crypto from 'crypto';

// Service for handling data encryption/decryption to meet HIPAA requirements
// This uses AWS KMS in production and a local key in development

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32; // 256 bits

let encryptionKey: Buffer = null;

// Initialize the encryption service
export const initializeEncryption = async (): Promise<void> => {
  if (encryptionKey) return;

  // In production, use AWS KMS to get the data key
  if (process.env.NODE_ENV === 'production' && process.env.KMS_KEY_ID) {
    try {
      const kms = new AWS.KMS();
      const { Plaintext } = await kms.generateDataKey({
        KeyId: process.env.KMS_KEY_ID,
        KeySpec: 'AES_256'
      }).promise();

      encryptionKey = Buffer.from(Plaintext as Buffer);
    } catch (error) {
      console.error('Error generating data key from KMS', error);
      throw error;
    }
  } else {
    // For development/testing, use an environment variable or a fixed key
    const devKey = process.env.DEV_ENCRYPTION_KEY || 'SafetyPin-Dev-Key-For-Local-Development';
    encryptionKey = crypto.createHash('sha256').update(devKey).digest();
  }
};

// Encrypt sensitive data
export const encrypt = async (plaintext: string): Promise<string> => {
  if (!encryptionKey) {
    await initializeEncryption();
  }

  // Create a random initialization vector
  const iv = crypto.randomBytes(IV_LENGTH);
  
  // Create cipher with key, iv, and algorithm
  const cipher = crypto.createCipheriv(ALGORITHM, encryptionKey, iv);
  
  // Encrypt the data
  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  // Get the auth tag
  const authTag = cipher.getAuthTag();
  
  // Format: iv:authTag:encryptedData
  return Buffer.concat([iv, authTag, Buffer.from(encrypted, 'base64')])
    .toString('base64');
};

// Decrypt sensitive data
export const decrypt = async (encryptedText: string): Promise<string> => {
  if (!encryptionKey) {
    await initializeEncryption();
  }

  // Convert from base64 to buffer
  const buffer = Buffer.from(encryptedText, 'base64');
  
  // Extract parts
  const iv = buffer.slice(0, IV_LENGTH);
  const authTag = buffer.slice(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encryptedData = buffer.slice(IV_LENGTH + AUTH_TAG_LENGTH);
  
  // Create decipher
  const decipher = crypto.createDecipheriv(ALGORITHM, encryptionKey, iv);
  decipher.setAuthTag(authTag);
  
  // Decrypt the data
  let decrypted = decipher.update(encryptedData.toString('base64'), 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};

// Rotate encryption keys (for compliance with key rotation requirements)
export const rotateEncryptionKey = async (): Promise<void> => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn('Key rotation not supported in development mode');
    return;
  }

  try {
    // Store the old key for decryption of existing data
    const oldKey = encryptionKey;
    
    // Generate a new key
    const kms = new AWS.KMS();
    const { Plaintext } = await kms.generateDataKey({
      KeyId: process.env.KMS_KEY_ID,
      KeySpec: 'AES_256'
    }).promise();

    encryptionKey = Buffer.from(Plaintext as Buffer);
    
    // In a real implementation, you would:
    // 1. Store the new key identifier
    // 2. Implement a key version mechanism
    // 3. Re-encrypt critical data with the new key
    
    console.log('Encryption key rotated successfully');
  } catch (error) {
    console.error('Error rotating encryption key', error);
    throw error;
  }
};

// Hash sensitive data for lookups (e.g., PII that needs to be queried)
export const hashForLookup = (plaintext: string): string => {
  return crypto.createHash('sha256').update(plaintext).digest('hex');
};

// Create a secure random ID (for user IDs, session IDs, etc.)
export const generateSecureId = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};
