# SafetyPin Cloud

SafetyPin is a secure file transfer solution that enables users to create ephemeral SFTP connections that route directly to Amazon S3 buckets. The application provides a user-friendly web interface for managing these connections without requiring clients to have AWS knowledge or maintain their own servers.

## Project Status

SafetyPin is currently in active development. The OSS Edition is being developed with core functionality implemented first, followed by commercial features. The following components are in development:

- ✅ **Database Layer**: PostgreSQL schema design, migration system, and repository implementations complete
- ✅ **Development Environment**: Docker containerization for easy local development
- ✅ **Basic Backend API**: Core Express server setup with middleware and error handling
- ✅ **Frontend-Backend Integration**: API service and testing components in place
- 🚧 **Authentication Services**: In-progress implementation of user management, auth, SSO, and MFA
- 🚧 **API Implementation**: In-progress development of REST endpoints for core functionality
- 🚧 **Cloud Integration**: Upcoming work on AWS, Azure, and GCP integrations
- 🚧 **Frontend UI Components**: In-progress development of authentication and server management UI

See the [Project Todos](./docs/project-todos.md) file for a detailed breakdown of completed and pending tasks.

## What is SafetyPin?

SafetyPin helps you:
- Create ephemeral SFTP connections that route directly to S3 buckets
- Provide secure file transfer capabilities to clients without AWS knowledge
- Keep track of all file transfers and access attempts
- Manage connections with granular security controls and expiration dates
- Store and organize transferred files in your own S3 buckets

## Architecture

The application follows a three-tier architecture:

1. **Frontend (safetypin-frontend)**:
   - Built with React.js and TypeScript
   - Uses Material-UI (MUI) for the UI components
   - AWS Amplify for authentication and API integration
   - React Router for navigation
   - Axios for API requests

2. **Backend (safetypin-backend)**:
   - Serverless architecture using AWS Lambda functions
   - Organized into functional areas (auth, billing, files, servers)
   - Node.js runtime
   - PostgreSQL database for HIPAA compliance
   - Repository pattern for data access

3. **Infrastructure (safetypin-infrastructure)**:
   - AWS CDK for infrastructure as code
   - Multiple infrastructure stacks:
     - API Stack
     - Authentication Stack
     - Database Stack
     - Frontend Stack
     - Monitoring Stack
     - SFTP Stack (AWS Transfer Family)

## Project Structure

```
safetypin-cloud/
├── safetypin-frontend/     # The web interface
├── safetypin-backend/      # The server code that runs in AWS
│   ├── src/
│   │   ├── api/            # Express API routes and controllers
│   │   ├── config/         # Application configuration
│   │   ├── db/             # Database migrations and connection
│   │   ├── models/         # Database models and interfaces
│   │   ├── repositories/   # Data access repositories
│   │   └── services/       # Business logic services
└── safetypin-infrastructure/ # The code that sets up AWS resources
```

## Database Design

SafetyPin uses PostgreSQL as the primary database for HIPAA compliance. The database design follows these principles:

- Schema with comprehensive tables for users, organizations, servers, files, and more
- Encryption utilities for sensitive data using industry-standard algorithms
- Migration system with version control for seamless upgrades
- Repository pattern implementation providing a clean abstraction over data access

Each repository implements a TypeScript interface that defines its capabilities, making it easy to create mocks for testing or switch implementations if needed.

## Getting Started with Docker

The easiest way to run SafetyPin locally is using Docker Compose:

### Prerequisites

- Docker and Docker Compose installed on your machine
- Git

### Running the Development Environment

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/safetypin-cloud.git
   cd safetypin-cloud
   ```

2. Start the development environment:
   ```bash
   # Windows
   docker-up.bat
   
   # Linux/Mac
   ./docker-up.sh
   ```
   
   Alternatively:
   ```bash
   docker-compose -f docker-compose.dev.yml up
   ```

3. Access the application:
   - Frontend: http://localhost:3001 (maps to port 3000 on the container)
   - Backend API: http://localhost:3000
   - PostgreSQL: localhost:5432

4. Development:
   - The frontend and backend source directories are mounted as volumes
   - Changes will be automatically reloaded
   - When running in Docker, the frontend communicates with the backend using the internal Docker service name: `http://backend:3000`

### Running the Production Environment

1. Build and start the production environment:
   ```bash
   docker-compose up -d
   ```

2. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:3000

## Manual Setup (without Docker)

### Requirements

Before you start, make sure you have:
- Node.js 14 or newer
- PostgreSQL 14 or newer
- An AWS account
- AWS CLI installed and configured
- Git

## Setting Up Your Local Environment

### Windows Setup

1. **Install Node.js**:
   - Download the installer from [nodejs.org](https://nodejs.org/)
   - Run the installer and follow the instructions
   - To verify installation, open Command Prompt and type: `node --version`

2. **Install Git**:
   - Download from [git-scm.com](https://git-scm.com/download/win)
   - Run the installer (use default settings)
   - To verify installation, open Command Prompt and type: `git --version`

3. **Install PostgreSQL**:
   - Download the installer from [postgresql.org](https://www.postgresql.org/download/windows/)
   - Run the installer and remember the password you set for the postgres user
   - Add PostgreSQL bin directory to your PATH if the installer doesn't do it

4. **Clone the Repository**:
   - Open Command Prompt
   - Navigate to where you want to store the project: `cd C:\Projects` (or your preferred location)
   - Clone the repo: `git clone https://github.com/your-username/safetypin-cloud.git`
   - Go to project folder: `cd safetypin-cloud`

### Mac Setup

1. **Install Homebrew** (if not already installed):
   - Open Terminal
   - Run: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

2. **Install Node.js**:
   - In Terminal, run: `brew install node`
   - Verify with: `node --version`

3. **Install PostgreSQL**:
   - In Terminal, run: `brew install postgresql`
   - Start the service: `brew services start postgresql`

4. **Clone the Repository**:
   - Open Terminal
   - Navigate to where you want to store the project: `cd ~/Projects` (or your preferred location)
   - Clone the repo: `git clone https://github.com/your-username/safetypin-cloud.git`
   - Go to project folder: `cd safetypin-cloud`

### Setting Up the Backend

1. Go to the backend folder:
   ```
   cd safetypin-backend
   ```

2. Copy the example environment file:
   ```
   cp .env.example .env
   ```

3. Install the packages:
   ```
   npm install
   ```

4. Run database migrations:
   ```
   npm run migrate:up
   ```

5. Start the development server:
   ```
   npm run dev
   ```

### Setting Up the Frontend

1. Go to the frontend folder:
   ```
   cd safetypin-frontend
   ```

2. Install the packages:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run start:alt
   ```
   or
   ```
   # Windows
   set PORT=3001 && npm start
   
   # Linux/Mac
   PORT=3001 npm start
   ```

4. Open your browser and go to: http://localhost:3001

## Running Tests

SafetyPin uses Jest for both frontend and backend testing. Here's how to run the tests:

### Backend Tests

1. Navigate to the backend directory:
   ```
   cd safetypin-backend
   ```

2. Run all tests:
   ```
   npm test
   ```

3. Run tests with coverage:
   ```
   npm run test:coverage
   ```

4. Run a specific test file:
   ```
   npm test -- src/repositories/__tests__/userRepository.test.ts
   ```

### Frontend Tests

1. Navigate to the frontend directory:
   ```
   cd safetypin-frontend
   ```

2. Run all tests:
   ```
   npm test
   ```

3. Run tests with coverage:
   ```
   npm run test:coverage
   ```

## Development Workflow

SafetyPin follows a GitFlow-inspired branching strategy:

1. `main` - production-ready code
2. `develop` - integration branch for new features
3. Feature branches - named as `feature/feature-name`
4. Bugfix branches - named as `bugfix/issue-description`

### Current Development Priorities

Current development priorities (as of March 2025) are:

1. Implementing the service layer for authentication (User, Auth, SSO, MFA services)
2. Defining and implementing API endpoints for core functionality
3. Implementing cloud integration services (AWS/Azure/GCP)
4. Developing frontend authentication components

If you'd like to contribute, please focus on these areas. See the [Project Todos](./docs/project-todos.md) file for the most up-to-date list of tasks.

## Core Features

### SFTP Server Management
- Create ephemeral SFTP connections with specific configurations
- Choose server regions, storage size, and username
- Monitor server status and storage usage
- Web-based client for file transfers

### Security Features
- SSH key management (generate or upload)
- IP whitelisting for connections
- Strict host key checking
- Secure credential sharing
- HIPAA-compliant audit logging and encryption

### Lifecycle Management
- Time-based expiration for SFTP connections
- Auto-terminate on file transfer completion
- Data preservation options (destroy, preserve, archive)
- Notifications for connection expiry

### Monitoring and Analytics
- Track all file transfers
- View detailed activity logs
- Monitor transfer status in real-time
- Server usage statistics

### User Management
- User authentication and authorization
- SSO integration via SAML and OIDC
- Multi-factor authentication
- Profile management
- Security settings
- Billing and usage tracking

## Technical Implementation

1. **Authentication**:
   - AWS Cognito for user authentication
   - JWT-based API authorization
   - Support for SAML 2.0 and OIDC
   - Multi-factor authentication

2. **File Storage**:
   - Amazon S3 for file storage
   - Configurable bucket policies
   - Support for multiple cloud providers (AWS, Azure, GCP)

3. **SFTP Service**:
   - AWS Transfer Family for SFTP server provisioning
   - Custom identity provider for user management

4. **API Layer**:
   - RESTful API design
   - Serverless architecture
   - Input validation
   - Repository pattern for data access

5. **Database**:
   - PostgreSQL for HIPAA-compliant data storage
   - Migration system with version control
   - Encrypted sensitive data fields

6. **Monitoring**:
   - CloudWatch for logging and metrics
   - Comprehensive audit logging
   - Alerts for critical events

## User Flow

1. User registers and logs into the application
2. User creates a new SFTP connection with security and lifecycle settings
3. System provisions an ephemeral SFTP server connected to an S3 bucket
4. User shares connection details with clients
5. Clients connect to the SFTP server using standard SFTP tools
6. Files are transferred to/from the S3 bucket
7. User monitors transfer activity through the dashboard
8. Server is terminated based on lifecycle settings

## Edition-Specific Features

SafetyPin uses a feature flag system to control which features are available in different editions of the application. This allows the same codebase to be used for both OSS and commercial editions.

### Feature Flag Implementation

Feature flags are managed through a configuration system that:

1. Reads edition type from environment variables
2. Controls feature availability based on edition
3. Provides utility functions to check feature availability

Example usage:
```typescript
import { isFeatureEnabled } from '../config/features';

if (isFeatureEnabled('billing.subscription')) {
  // Commercial edition code
} else {
  // OSS edition code
}
```

See the [Feature Flags Documentation](./docs/feature-flags.md) for more information.

## Troubleshooting

### Running with Docker Compose
- If you make changes to Docker configuration, rebuild with `docker-compose -f docker-compose.dev.yml up --build`
- Check Docker logs for errors: `docker-compose logs backend` or `docker-compose logs frontend`
- Ensure the database is properly initialized: `docker-compose logs postgres`

### Running Without Docker (Local Development)
- If you're experiencing issues with the frontend connecting to the API, check the API Test page at `/api-test`
- Ensure PostgreSQL is running and accessible with the credentials specified in your .env file
- The backend API server runs on port 3000, frontend on port 3001 by default

### TypeScript Type Safety
- When working with error handling, remember to properly type check `unknown` error types
- Use type guards to safely access properties
- When using API methods that require `Record<string, unknown>`, you may need to cast custom interfaces
- Run `npm run type-check` regularly to catch type issues before they cause runtime problems

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

When contributing, please keep in mind the current project priorities as outlined in the [Project Todos](./docs/project-todos.md) file.

## License

SafetyPin Cloud is available in multiple editions to suit different needs:

### SafetyPin OSS Edition
- Licensed under AGPL v3.0 for non-commercial use
- Includes all core SFTP and file transfer functionality
- Self-hosted on your own infrastructure
- No usage limits for servers or storage
- See [LICENSE](./LICENSE) file for full details

### SafetyPin Cloud Edition (Commercial)
- Requires a paid commercial license
- Includes all OSS features plus:
  - Billing and subscription management
  - Advanced security features
  - Multi-tenant capabilities
  - Premium support
- Usage based on subscription plan

### SafetyPin Enterprise Edition (Commercial)
- Custom commercial licensing
- Includes all Cloud features plus:
  - Custom deployment options
  - Advanced compliance features
  - Enterprise-grade support
  - Custom integrations

For commercial licensing inquiries, please contact Craine Technology Labs at hello@craine.io