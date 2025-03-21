# SafetyPin Cloud - Modern UI

This branch contains a modern UI implementation for the SafetyPin Cloud frontend application. The design follows modern UI/UX best practices and uses Material UI components to create a clean, professional interface.

## Features

- **Modern Theme System**: Custom theme with improved typography, colors, and component styling
- **Responsive Layout**: Works on desktops, tablets, and mobile devices
- **Dashboard with Statistics**: Visual presentation of key metrics and activity
- **Server Management UI**: Card-based layout for easy scanning and management
- **Consistent Page Headers**: With breadcrumbs and actions
- **Authentication Screens**: Clean, modern login and registration forms

## Components

- `Layout` - Main application layout with responsive sidebar navigation
- `PageHeader` - Consistent page headers with breadcrumbs and action buttons
- `Dashboard` - Overview page with statistics and activity feeds
- `ServerList` - Grid layout for server management with interactive cards

## Technologies Used

- React 18
- TypeScript 4
- Material UI 5
- React Router 6
- AWS Amplify (Auth)

## Getting Started

### Standard Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

### Docker Setup

1. Build and run the Docker container:
   ```bash
   # Using Docker Compose
   docker-compose up -d

   # OR using the provided scripts
   # On Linux/macOS:
   ./docker-build.sh

   # On Windows:
   docker-build.bat
   ```

2. Access the application at http://localhost:3000

3. To stop the container:
   ```bash
   # Using Docker Compose
   docker-compose down

   # OR using Docker directly
   docker stop safetypin-frontend
   docker rm safetypin-frontend
   ```

## Docker Deployment

The application is containerized for easy deployment to various environments:

- **Local Development**: Uses Docker Compose for a simple local setup
- **AWS ECS Deployment**: Ready for deployment to AWS Elastic Container Service
- **Container Registry**: Can be pushed to ECR, Docker Hub, or other container registries

### Container Features

- Multi-stage build for smaller image size
- Nginx for efficient static file serving
- Proper cache headers for static assets
- Configured for SPAs with proper routing support
- Environment variable support

## Implementation Notes

- The UI uses a custom theme that can be found in `src/theme/index.ts`
- All components follow a consistent design language
- Authentication using AWS Amplify is integrated throughout the UI
- Responsive design principles are applied to all components

## Screenshots

(Add screenshots here when available)

## Next Steps

- Complete remaining pages (ServerDetails, WebClient, etc.)
- Add data visualization components
- Implement real data fetching from backend
- Add unit and integration tests

## Contributors

- Your Name
