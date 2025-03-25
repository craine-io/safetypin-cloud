# SafetyPin OSS

SafetyPin OSS is a secure file transfer solution that enables clients to transfer files to Amazon S3 buckets through ephemeral SFTP connections without requiring them to maintain their own servers. This is the open-source version of the SafetyPin project created by Craine Technology Labs.

## What is SafetyPin OSS?

SafetyPin OSS helps you:
- Create ephemeral SFTP connections that route directly to S3 buckets
- Provide secure file transfer capabilities to clients without AWS knowledge
- Keep track of all file transfers and access attempts
- Manage connections with granular security controls and expiration dates
- Store and organize transferred files in your own S3 buckets

## Project Structure

The project has three main parts:

```
safetypin-oss/
├── safetypin-frontend/     # The web interface
├── safetypin-backend/      # The server code that runs in AWS
└── safetypin-infrastructure/ # The code that sets up AWS resources
```

## Getting Started with Docker

The easiest way to run SafetyPin OSS locally is using Docker Compose:

### Prerequisites

- Docker and Docker Compose installed on your machine
- Git

### Running the Development Environment

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/safetypin-oss.git
   cd safetypin-oss
   ```

2. Start the development environment:
   ```bash
   docker-compose -f docker-compose.dev.yml up
   ```

3. Access the application:
   - Frontend: http://localhost:3001 (maps to port 3000 on the container)
   - Backend API: http://localhost:3000

4. Development:
   - The frontend and backend source directories are mounted as volumes
   - Changes will be automatically reloaded

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
   - Clone the repo: `git clone https://github.com/your-username/safetypin-oss.git`
   - Go to project folder: `cd safetypin-oss`

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
   - Clone the repo: `git clone https://github.com/your-username/safetypin-oss.git`
   - Go to project folder: `cd safetypin-oss`

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
   npm start
   ```

4. Open your browser and go to: http://localhost:3000
   - Note: When running locally without Docker, the frontend runs on port 3000
   - When using Docker, access the frontend at http://localhost:3001

## How to Use SafetyPin OSS

### Creating an SFTP Connection

1. Log in to the SafetyPin OSS web interface
2. Click "New Connection" on the dashboard
3. Enter a name for your connection
4. Select or create an S3 bucket destination
5. Configure security settings and expiration date
6. Click "Create Connection"

### Providing Connection Details to Clients

1. Go to the "Connections" page
2. Select your connection
3. Copy the hostname, username, and password
4. Share these credentials securely with your client

### Monitoring File Transfers

1. Go to the "Connections" page
2. Select your connection
3. Navigate to the "Activity Log" tab
4. View all file transfers, including timestamps, file sizes, and status

## Features

### User Management
- Sign up and login
- Password reset
- User profile management

### Connection Management
- Create and manage ephemeral SFTP connections
- View connection details and status
- Set expiration dates and security parameters

### S3 Bucket Management
- Create and configure S3 buckets
- Browse bucket contents
- Manage storage and lifecycle policies

### File Transfer Monitoring
- Track all file transfers
- View detailed activity logs
- Monitor transfer status in real-time

### Security
- All transfers encrypted in transit
- Temporary access credentials
- IP-based restrictions
- File type filtering
- Size limits

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License and Editions

SafetyPin is available in multiple editions to suit different needs:

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

For commercial licensing inquiries, please contact Craine Technology Labs at contact@crainetech.com

### Feature Flags

SafetyPin uses a feature flag system to manage edition-specific features. See the [Feature Flags Documentation](./docs/feature-flags.md) for more information.
