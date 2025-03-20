# SafetyPin Cloud

SafetyPin Cloud is a secure file transfer service that lets you create and manage SFTP servers in the cloud.

## What is SafetyPin Cloud?

SafetyPin Cloud helps you:
- Create secure SFTP servers with just a few clicks
- Transfer files safely between computers
- Keep track of your file transfers
- Manage your servers and security settings

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

### Creating an SFTP Server

1. Log in to the SafetyPin web interface
2. Click "Create Server" on the dashboard
3. Enter a name for your server
4. Choose the server size and region
5. Click "Create"

### Connecting to Your SFTP Server

1. Go to the "Servers" page
2. Select your server
3. Click "Connection Details"
4. Use the hostname, username, and your SSH key to connect

You can connect using:
- FileZilla (Easy for beginners): [FileZilla Tutorial](https://www.youtube.com/watch?v=adxmlHDim6c)
- WinSCP on Windows: [WinSCP Tutorial](https://www.youtube.com/watch?v=hRoaI0EANKc)
- Command line SFTP on Mac or Linux: Type `sftp username@hostname`

### Managing Files in the Web Client

1. Go to the "Servers" page
2. Select your server
3. Click "Web Client"
4. Use the file browser to upload, download, and manage files

## Features

### User Management
- Sign up and login
- Password reset
- User profile management

### Server Management
- Create and delete SFTP servers
- View server details and status
- Restart servers

### File Transfer
- Web-based file browser
- Upload and download files
- Manage file permissions

### Security
- All transfers encrypted
- SSH key authentication
- Secure password storage

### Billing and Usage
- Pay-as-you-go pricing
- Usage statistics
- Billing history

## Troubleshooting

### Can't Connect to Your Server?
- Check if the server is running on the dashboard
- Verify you're using the correct hostname and username
- Make sure your SSH key is set up correctly

### Deployment Problems?
- Check your AWS credentials are set up correctly
- Make sure you have the right permissions in your AWS account
- Look at the error messages in the console

## Security Notes

- Always keep your SSH keys secure
- Don't share your SafetyPin account credentials
- Regularly review your active servers

## Getting Help

If you need more help:
- Check the troubleshooting section above
- Watch the suggested YouTube tutorials
- Contact support at support@safetypin.cloud (example email)
