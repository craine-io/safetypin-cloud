# SafetyPin Cloud

SafetyPin Cloud is a secure file transfer solution that enables clients to transfer files to Amazon S3 buckets through ephemeral SFTP connections without requiring them to maintain their own servers.

## What is SafetyPin Cloud?

SafetyPin Cloud helps you:
- Create ephemeral SFTP connections that route directly to S3 buckets
- Provide secure file transfer capabilities to clients without AWS knowledge
- Keep track of all file transfers and access attempts
- Manage connections with granular security controls and expiration dates
- Store and organize transferred files in your own S3 buckets

## Project Structure

The project has three main parts:

```
safetypin-cloud/
├── safetypin-frontend/     # The web interface
├── safetypin-backend/      # The server code that runs in AWS
└── safetypin-infrastructure/ # The code that sets up AWS resources
```

## Getting Started

### Requirements

Before you start, make sure you have:
- Node.js 14 or newer
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

3. **Install AWS CLI**:
   - Download the AWS CLI installer from [AWS website](https://aws.amazon.com/cli/)
   - Run the installer
   - Open Command Prompt and configure AWS: `aws configure`
   - Enter your AWS Access Key, Secret Key, region (e.g., us-east-1), and output format (json)

4. **Clone the Repository**:
   - Open Command Prompt
   - Navigate to where you want to store the project: `cd C:\Projects` (or your preferred location)
   - Clone the repo: `git clone https://github.com/your-username/safetypin-cloud.git`
   - Go to project folder: `cd safetypin-cloud`

📺 **Need help setting up Windows?** Watch [Node.js and NPM on Windows](https://www.youtube.com/watch?v=X-FPCwZFU_8)

### Mac Setup

1. **Install Homebrew** (if not already installed):
   - Open Terminal
   - Run: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

2. **Install Node.js**:
   - In Terminal, run: `brew install node`
   - Verify with: `node --version`

3. **Install Git** (if not already installed):
   - In Terminal, run: `brew install git`
   - Verify with: `git --version`

4. **Install AWS CLI**:
   - In Terminal, run: `brew install awscli`
   - Configure AWS: `aws configure`
   - Enter your AWS Access Key, Secret Key, region (e.g., us-east-1), and output format (json)

5. **Clone the Repository**:
   - Open Terminal
   - Navigate to where you want to store the project: `cd ~/Projects` (or your preferred location)
   - Clone the repo: `git clone https://github.com/your-username/safetypin-cloud.git`
   - Go to project folder: `cd safetypin-cloud`

📺 **Need help setting up Mac?** Watch [Node.js Setup on Mac](https://www.youtube.com/watch?v=0hh-vdlU4Xw)

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

### Fixing Git Line Ending Issues

If you encounter warnings about line endings (LF vs. CRLF), follow these steps:

1. Ensure you have the correct Git configuration files:
   ```
   # Check if the files exist at the root of the repository
   ls -la .gitattributes .gitignore
   ```

2. If needed, remove node_modules from Git tracking:
   ```
   git rm -r --cached safetypin-frontend/node_modules
   ```

3. Add and commit the Git configuration files:
   ```
   git add .gitattributes .gitignore
   git commit -m "Add Git configuration files"
   ```

4. For new projects, consider configuring Git line endings:
   ```
   # For Windows:
   git config --global core.autocrlf true
   
   # For Mac/Linux:
   git config --global core.autocrlf input
   ```

📺 **Need help with React?** Watch [React JS Crash Course](https://www.youtube.com/watch?v=w7ejDZ8SWv8)

### Setting Up the Backend

1. Go to the backend folder:
   ```
   cd safetypin-backend
   ```

2. Install the packages:
   ```
   npm install
   ```

3. Deploy to AWS:
   ```
   npx serverless deploy
   ```

📺 **Need help with AWS Serverless?** Watch [AWS Serverless Tutorial](https://www.youtube.com/watch?v=n5oVQ4HBaHY)

### Setting Up the Infrastructure

1. Go to the infrastructure folder:
   ```
   cd safetypin-infrastructure
   ```

2. Install the packages:
   ```
   npm install
   ```

3. Deploy the AWS infrastructure:
   ```
   npx cdk deploy
   ```

📺 **Need help with AWS CDK?** Watch [AWS CDK Tutorial](https://www.youtube.com/watch?v=Cf2fuE1QH7c)

## How to Use SafetyPin Cloud

### Creating an SFTP Connection

1. Log in to the SafetyPin web interface
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

You can connect using:
- FileZilla (Easy for beginners): [FileZilla Tutorial](https://www.youtube.com/watch?v=adxmlHDim6c)
- WinSCP on Windows: [WinSCP Tutorial](https://www.youtube.com/watch?v=hRoaI0EANKc)
- Command line SFTP on Mac or Linux: Type `sftp username@hostname`

### Monitoring File Transfers

1. Go to the "Connections" page
2. Select your connection
3. Navigate to the "Activity Log" tab
4. View all file transfers, including timestamps, file sizes, and status
5. Filter activity by date, event type, or status

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

### Billing and Usage
- Pay-as-you-go pricing
- Usage statistics
- Billing history

## Troubleshooting

### Client Connection Issues
- Verify the connection hasn't expired
- Check if IP restrictions are enabled and client's IP is allowed
- Confirm the client is using the correct hostname, port, username, and password
- Ensure the client's network allows SFTP traffic

### File Transfer Problems
- Check if files exceed the maximum size limit
- Verify file types match the allowed extensions
- Confirm there's sufficient space in the S3 bucket
- Check S3 bucket permissions and policies

### Deployment Problems
- Verify your AWS credentials are set up correctly
- Make sure you have the right permissions in your AWS account
- Check the deployment logs for specific error messages
- Ensure AWS Transfer Family service is available in your region

## Security Notes

- Never share connection credentials via unsecured channels
- Use time-limited connections appropriate for the use case
- Enable IP restrictions whenever possible
- Regularly review active connections and transfer logs
- Configure appropriate S3 bucket policies for additional security

## Getting Help

If you need more help:
- Check the troubleshooting section above
- Watch the suggested YouTube tutorials
- Contact support at support@safetypin.cloud (example email)
