import { UserRepository } from './user.repository';
import { OrganizationRepository } from './organization.repository';
import { IdentityProviderRepository } from './identity-provider.repository';
import { SessionRepository } from './session.repository';
import { MfaRepository } from './mfa.repository';
import { AuditRepository } from './audit.repository';
import { PermissionRepository } from './permission.repository';
import { CloudProviderRepository, CloudCredentialRepository } from './cloud.repository';

// Import implementations
import { UserPostgresRepository } from './postgres/user-postgres.repository';
// Other repository implementations will be imported as they are implemented

export type DatabaseType = 'postgres' | 'mysql' | 'mongodb';

export class RepositoryFactory {
  private static instance: RepositoryFactory;
  private databaseType: DatabaseType;
  
  // Repository instances
  private userRepository: UserRepository;
  // Other repositories will be added here
  
  private constructor(databaseType: DatabaseType = 'postgres') {
    this.databaseType = databaseType;
    this.initializeRepositories();
  }
  
  public static getInstance(databaseType: DatabaseType = 'postgres'): RepositoryFactory {
    if (!RepositoryFactory.instance) {
      RepositoryFactory.instance = new RepositoryFactory(databaseType);
    }
    
    return RepositoryFactory.instance;
  }
  
  private initializeRepositories(): void {
    switch (this.databaseType) {
      case 'postgres':
        this.userRepository = new UserPostgresRepository();
        // Initialize other PostgreSQL repositories
        break;
        
      case 'mysql':
        // MySQL implementations would go here
        throw new Error('MySQL repositories not yet implemented');
        
      case 'mongodb':
        // MongoDB implementations would go here
        throw new Error('MongoDB repositories not yet implemented');
        
      default:
        throw new Error(`Unsupported database type: ${this.databaseType}`);
    }
  }
  
  // Repository getters
  public getUserRepository(): UserRepository {
    return this.userRepository;
  }
  
  // Other repository getters will be added here
}

// Helper function to get repositories
export function getRepositories(databaseType: DatabaseType = 'postgres') {
  const factory = RepositoryFactory.getInstance(databaseType);
  
  return {
    userRepository: factory.getUserRepository(),
    // Other repositories will be added here
  };
}
