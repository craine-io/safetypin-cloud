# SafetyPin Application Summary

## Overview
SafetyPin is a secure file transfer solution that enables users to create ephemeral SFTP connections that route directly to Amazon S3 buckets. The application provides a user-friendly web interface for managing these connections without requiring clients to have AWS knowledge or maintain their own servers.

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

3. **Infrastructure (safetypin-infrastructure)**:
   - AWS CDK for infrastructure as code
   - Multiple infrastructure stacks:
     - API Stack
     - Authentication Stack
     - Database Stack
     - Frontend Stack
     - Monitoring Stack
     - SFTP Stack (AWS Transfer Family)

## Core Features

1. **SFTP Server Management**:
   - Create ephemeral SFTP connections with specific configurations
   - Choose server regions, storage size, and username
   - Monitor server status and storage usage
   - Web-based client for file transfers

2. **Security Features**:
   - SSH key management (generate or upload)
   - IP whitelisting for connections
   - Strict host key checking
   - Secure credential sharing

3. **Lifecycle Management**:
   - Time-based expiration for SFTP connections
   - Auto-terminate on file transfer completion
   - Data preservation options (destroy, preserve, archive)
   - Notifications for connection expiry

4. **Monitoring and Analytics**:
   - Track all file transfers
   - View detailed activity logs
   - Monitor transfer status in real-time
   - Server usage statistics

5. **User Management**:
   - User authentication and authorization
   - Profile management
   - Security settings
   - Billing and usage tracking

## Technical Implementation

1. **Authentication**:
   - AWS Cognito for user authentication
   - JWT-based API authorization

2. **File Storage**:
   - Amazon S3 for file storage
   - Configurable bucket policies

3. **SFTP Service**:
   - AWS Transfer Family for SFTP server provisioning
   - Custom identity provider for user management

4. **API Layer**:
   - RESTful API design
   - Serverless architecture
   - Input validation using Joi

5. **Monitoring**:
   - CloudWatch for logging and metrics
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

## Deployment Architecture

The application is deployed on AWS with the following key resources:
- AWS Amplify for frontend hosting
- AWS Lambda for backend functions
- Amazon S3 for storage
- AWS Transfer Family for SFTP servers
- Amazon DynamoDB for metadata storage
- Amazon Cognito for authentication
- CloudWatch for monitoring