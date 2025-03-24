# SafetyPin OSS Backend

This is the backend service for SafetyPin OSS, a secure SFTP server management solution. It provides APIs for user authentication, server management, and multi-cloud support.

## Database Architecture

The SafetyPin OSS backend uses PostgreSQL as its primary database technology for the following reasons:

### HIPAA Compliance Support

- **Column-level encryption** via pgcrypto extension for sensitive data
- **Row-level security** for multi-tenant data isolation
- **Comprehensive audit logging** for tracking all authentication and data access events
- **Strong access controls** and authentication mechanisms
- **Automated data retention** policies can be implemented with partitioning

### Schema Compatibility

- Native support for **JSON/JSONB data types** for flexible configurations
- Excellent support for **UUID primary keys** for enhanced security
- Robust **indexing capabilities** for performant queries on large datasets
- Support for complex data relationships with advanced JOIN capabilities

### Enterprise Features

- **High availability** and failover capabilities
- **Point-in-time recovery** for disaster recovery
- **Encryption at rest and in transit** support
- Excellent support across all major cloud providers (AWS, Azure, GCP)

## Project Structure

```
safetypin-backend/
├── src/
│   ├── index.ts                # Application entry point
│   ├── components/             # Feature-oriented components
│   ├── lib/                    # Shared libraries and utilities
│   │   ├── database/           # Database configuration and migrations
│   │   │   ├── config.ts       # Database connection configuration
│   │   │   ├── encryption.ts   # Data encryption utilities
│   │   │   ├── migrator.ts     # Migration runner
│   │   │   └── migrations/     # Migration scripts
│   │   ├── repositories/       # Data access layer
│   │   │   ├── postgres/       # PostgreSQL implementations
│   │   │   ├── index.ts        # Repository interfaces
│   │   └── utils/              # Common utilities
│   ├── models/                 # Domain models
│   │   ├── auth/               # Authentication models
│   │   ├── sftp/               # SFTP server models
│   ├── services/               # Business logic services
│   ├── api/                    # API routes and controllers
│   └── types/                  # TypeScript type definitions
└── tests/                      # Test files
```

## Database Schema Overview

The SafetyPin OSS backend uses a comprehensive schema designed for Enterprise SSO integration, multi-factor authentication, and multi-cloud capabilities:

- **Core Authentication**: Users, Organizations, and their relationships
- **SSO Configuration**: Identity Providers and external user mappings
- **Multi-Factor Authentication**: MFA methods, sessions, and verification
- **Session Management**: User sessions and refresh tokens
- **HIPAA Compliance**: Comprehensive audit logging and access tracking
- **Role-Based Access Control**: Roles, Permissions, and user assignments
- **Multi-Cloud Integration**: Cloud Provider credentials and configurations

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- AWS Account (for KMS and other cloud services)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment file and update it with your configuration:
   ```bash
   cp .env.example .env
   ```
4. Run database migrations:
   ```bash
   npm run migrate:up
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### Database Setup

1. Create a PostgreSQL database:
   ```sql
   CREATE DATABASE safetypin;
   ```
2. The migrations will automatically create all necessary tables, indexes, and extensions

## Development

### Running Migrations

```bash
# Run migrations up
npm run migrate:up

# Revert migrations
npm run migrate:down
```

### Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Building for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## Security Features

- **Data Encryption**: Sensitive data is encrypted at rest using AWS KMS
- **Password Hashing**: Passwords are hashed using bcrypt with proper salt rounds
- **JWT Authorization**: Secure token-based authentication
- **MFA Support**: Multiple options for two-factor authentication
- **Audit Logging**: Comprehensive logging for security events
- **HIPAA Compliance**: Designed to meet healthcare compliance requirements

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request
