import { UserPostgresRepository } from '../../postgres/user-postgres.repository';
import { CreateUserDto, UpdateUserDto, UserStatus } from '../../../../models/auth/user.model';
import * as bcrypt from 'bcryptjs';
import * as database from '../../../database/config';

// Mock database module
jest.mock('../../../database/config', () => ({
  query: jest.fn(),
  transaction: jest.fn((callback) => callback({ query: jest.fn() }))
}));

// Mock bcrypt for password hashing
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  hashSync: jest.fn().mockReturnValue('hashed_password_sync'),
  compare: jest.fn().mockResolvedValue(true)
}));

describe('UserPostgresRepository', () => {
  let repository: UserPostgresRepository;
  const mockQuery = database.query as jest.Mock;
  const mockTransaction = database.transaction as jest.Mock;
  
  beforeEach(() => {
    repository = new UserPostgresRepository();
    jest.clearAllMocks();
  });
  
  describe('findById', () => {
    it('should return null when user not found', async () => {
      // Mock empty result from database
      mockQuery.mockResolvedValueOnce({ rows: [] });
      
      const result = await repository.findById('non-existent-id');
      
      expect(result).toBeNull();
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM users WHERE id = $1'),
        ['non-existent-id']
      );
    });
    
    it('should return user when found', async () => {
      // Mock database response
      const mockUser = {
        id: 'user-123',
        email: 'user@example.com',
        first_name: 'Test',
        last_name: 'User',
        job_title: 'Developer',
        status: 'active',
        creation_time: new Date(),
        last_update_time: new Date(),
        last_login_time: null,
        password_hash: 'hashed_password',
        password_last_changed: null,
        force_password_change: false,
        avatar_url: null,
        phone_number: null,
        timezone: 'UTC',
        locale: 'en-US',
        mfa_enabled: false
      };
      
      mockQuery.mockResolvedValueOnce({ rows: [mockUser] });
      
      const result = await repository.findById('user-123');
      
      expect(result).toEqual({
        id: 'user-123',
        email: 'user@example.com',
        firstName: 'Test',
        lastName: 'User',
        jobTitle: 'Developer',
        status: 'active',
        creationTime: mockUser.creation_time,
        lastUpdateTime: mockUser.last_update_time,
        lastLoginTime: null,
        passwordHash: 'hashed_password',
        passwordLastChanged: null,
        forcePasswordChange: false,
        avatarUrl: null,
        phoneNumber: null,
        timezone: 'UTC',
        locale: 'en-US',
        mfaEnabled: false
      });
      
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM users WHERE id = $1'),
        ['user-123']
      );
    });
  });
  
  describe('create', () => {
    it('should create a new user', async () => {
      const createDto: CreateUserDto = {
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User',
        password: 'password123',
        status: UserStatus.ACTIVE
      };
      
      const mockCreatedUser = {
        id: expect.any(String),
        email: 'new@example.com',
        first_name: 'New',
        last_name: 'User',
        status: 'active',
        password_hash: 'hashed_password_sync',
        creation_time: new Date(),
        last_update_time: new Date()
      };
      
      mockQuery.mockResolvedValueOnce({ rows: [mockCreatedUser] });
      
      const result = await repository.create(createDto);
      
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email', 'new@example.com');
      expect(result).toHaveProperty('firstName', 'New');
      expect(result).toHaveProperty('lastName', 'User');
      expect(result).toHaveProperty('status', 'active');
      
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        expect.arrayContaining([
          expect.any(String), // id
          'new@example.com',
          'New',
          'User',
          null, // jobTitle
          'active',
          'hashed_password_sync'
        ])
      );
      
      expect(bcrypt.hashSync).toHaveBeenCalledWith('password123', 10);
    });
  });
  
  describe('update', () => {
    it('should update an existing user', async () => {
      const updateDto: UpdateUserDto = {
        firstName: 'Updated',
        lastName: 'Name'
      };
      
      const mockUpdatedUser = {
        id: 'user-123',
        email: 'user@example.com',
        first_name: 'Updated',
        last_name: 'Name',
        status: 'active',
        last_update_time: new Date()
      };
      
      mockQuery.mockResolvedValueOnce({ rows: [mockUpdatedUser] });
      
      const result = await repository.update('user-123', updateDto);
      
      expect(result).toHaveProperty('id', 'user-123');
      expect(result).toHaveProperty('firstName', 'Updated');
      expect(result).toHaveProperty('lastName', 'Name');
      
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE users SET'),
        expect.arrayContaining(['Updated', 'Name', 'user-123'])
      );
    });
    
    it('should return null when updating non-existent user', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      
      const result = await repository.update('non-existent-id', { firstName: 'Test' });
      
      expect(result).toBeNull();
    });
  });
  
  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'user@example.com',
        first_name: 'Test',
        last_name: 'User',
        status: 'active'
      };
      
      mockQuery.mockResolvedValueOnce({ rows: [mockUser] });
      
      const result = await repository.findByEmail('user@example.com');
      
      expect(result).toHaveProperty('id', 'user-123');
      expect(result).toHaveProperty('email', 'user@example.com');
      
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM users WHERE email = $1'),
        ['user@example.com']
      );
    });
    
    it('should return null when email not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      
      const result = await repository.findByEmail('nonexistent@example.com');
      
      expect(result).toBeNull();
    });
  });
  
  describe('validateCredentials', () => {
    it('should return user when credentials are valid', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'user@example.com',
        password_hash: 'hashed_password',
        status: 'active'
      };
      
      mockQuery.mockResolvedValueOnce({ rows: [mockUser] });
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      
      const result = await repository.validateCredentials('user@example.com', 'correct-password');
      
      expect(result).not.toBeNull();
      expect(result).toHaveProperty('id', 'user-123');
      
      expect(bcrypt.compare).toHaveBeenCalledWith('correct-password', 'hashed_password');
    });
    
    it('should return null when credentials are invalid', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'user@example.com',
        password_hash: 'hashed_password',
        status: 'active'
      };
      
      mockQuery.mockResolvedValueOnce({ rows: [mockUser] });
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);
      
      const result = await repository.validateCredentials('user@example.com', 'wrong-password');
      
      expect(result).toBeNull();
    });
    
    it('should return null when user not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      
      const result = await repository.validateCredentials('nonexistent@example.com', 'password');
      
      expect(result).toBeNull();
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });
  });
  
  describe('updatePassword', () => {
    it('should update user password', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 1 });
      
      const result = await repository.updatePassword('user-123', 'new-password');
      
      expect(result).toBe(true);
      expect(bcrypt.hash).toHaveBeenCalledWith('new-password', 10);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE users SET password_hash = $1'),
        ['hashed_password', 'user-123']
      );
    });
    
    it('should return false when user not found', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 0 });
      
      const result = await repository.updatePassword('non-existent-id', 'new-password');
      
      expect(result).toBe(false);
    });
  });
  
  // Additional tests for other repository methods can be added here
});
