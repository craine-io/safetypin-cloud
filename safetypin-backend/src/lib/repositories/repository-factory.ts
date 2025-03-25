import { 
  UserRepository,
  OrganizationRepository,
  IdentityProviderRepository,
  SessionRepository,
  MfaRepository,
  AuditRepository,
  PermissionRepository,
  CloudProviderRepository,
  CloudCredentialRepository
} from './index';

import {
  UserPostgresRepository,
  OrganizationPostgresRepository,
  IdentityProviderPostgresRepository,
  SessionPostgresRepository,
  MfaPostgresRepository,
  AuditPostgresRepository,
  PermissionPostgresRepository,
  CloudProviderPostgresRepository,
  CloudCredentialPostgresRepository
} from './postgres';

export class RepositoryFactory {
  private static userRepository: UserRepository;
  private static organizationRepository: OrganizationRepository;
  private static identityProviderRepository: IdentityProviderRepository;
  private static sessionRepository: SessionRepository;
  private static mfaRepository: MfaRepository;
  private static auditRepository: AuditRepository;
  private static permissionRepository: PermissionRepository;
  private static cloudProviderRepository: CloudProviderRepository;
  private static cloudCredentialRepository: CloudCredentialRepository;
  
  // UserRepository
  static getUserRepository(): UserRepository {
    if (!this.userRepository) {
      this.userRepository = new UserPostgresRepository();
    }
    return this.userRepository;
  }
  
  // OrganizationRepository
  static getOrganizationRepository(): OrganizationRepository {
    if (!this.organizationRepository) {
      this.organizationRepository = new OrganizationPostgresRepository();
    }
    return this.organizationRepository;
  }
  
  // IdentityProviderRepository
  static getIdentityProviderRepository(): IdentityProviderRepository {
    if (!this.identityProviderRepository) {
      this.identityProviderRepository = new IdentityProviderPostgresRepository();
    }
    return this.identityProviderRepository;
  }
  
  // SessionRepository
  static getSessionRepository(): SessionRepository {
    if (!this.sessionRepository) {
      this.sessionRepository = new SessionPostgresRepository();
    }
    return this.sessionRepository;
  }
  
  // MfaRepository
  static getMfaRepository(): MfaRepository {
    if (!this.mfaRepository) {
      this.mfaRepository = new MfaPostgresRepository();
    }
    return this.mfaRepository;
  }
  
  // AuditRepository
  static getAuditRepository(): AuditRepository {
    if (!this.auditRepository) {
      this.auditRepository = new AuditPostgresRepository();
    }
    return this.auditRepository;
  }
  
  // PermissionRepository
  static getPermissionRepository(): PermissionRepository {
    if (!this.permissionRepository) {
      this.permissionRepository = new PermissionPostgresRepository();
    }
    return this.permissionRepository;
  }
  
  // CloudProviderRepository
  static getCloudProviderRepository(): CloudProviderRepository {
    if (!this.cloudProviderRepository) {
      this.cloudProviderRepository = new CloudProviderPostgresRepository();
    }
    return this.cloudProviderRepository;
  }
  
  // CloudCredentialRepository
  static getCloudCredentialRepository(): CloudCredentialRepository {
    if (!this.cloudCredentialRepository) {
      this.cloudCredentialRepository = new CloudCredentialPostgresRepository();
    }
    return this.cloudCredentialRepository;
  }
}
