# SafetyPin Frontend Docker Development and Testing

This document provides instructions for using Docker containers for development and testing of the SafetyPin frontend.

## Benefits of Docker-based Testing

1. **Consistent Environment**: Everyone runs tests in the exact same environment
2. **Isolation**: Tests run in an isolated environment without affecting your local system
3. **CI/CD Similarity**: Local tests run in an environment similar to CI/CD
4. **No Local Dependencies**: No need to install Node.js or other tools locally
5. **Simplified Setup**: One-command setup for development environment

## Prerequisites

- Docker
- Docker Compose

## Available Docker Commands

### Development

Start the development server in a Docker container:

```bash
# Start development environment
docker-compose up

# Build and start in detached mode
docker-compose up -d

# Stop all containers
docker-compose down
```

### Testing

```bash
# Run unit tests once
docker-compose -f docker-compose.test.yml run --rm test

# Run unit tests in watch mode
docker-compose -f docker-compose.test.yml run --rm test:watch

# Run end-to-end tests with Cypress
docker-compose -f docker-compose.test.yml up -d app
docker-compose -f docker-compose.test.yml run --rm cypress
docker-compose -f docker-compose.test.yml down
```

### Building

```bash
# Build production Docker image
docker build -t safetypin-frontend .

# Run the built image
docker run -p 8080:80 safetypin-frontend
```

## Docker Compose Configuration

### Development Configuration

The `docker-compose.yml` file includes:

- React application with hot reloading
- Shared volumes for real-time code changes
- Port mapping for local access

### Testing Configuration

The `docker-compose.test.yml` file includes:

- Unit test service with Jest
- Watch mode for TDD workflow
- Cypress for end-to-end testing
- Minimal app instance for E2E tests

## CI/CD Integration

The same Docker containers used for local development and testing are also used in the CI/CD pipeline:

1. GitHub Actions runs tests using the same Docker configuration
2. Test images are cached to speed up builds
3. Successful tests lead to automatic deployment

## Troubleshooting

### Volume Mounting Issues

If you experience issues with volume mounting in Docker:

```bash
# Reset volumes
docker-compose down -v
docker-compose up
```

### Watch Mode Not Detecting Changes

```bash
# Set environment variable for polling
CHOKIDAR_USEPOLLING=true docker-compose up
```

### Permission Issues

```bash
# Fix permissions on Linux
sudo chown -R $(id -u):$(id -g) .
```

## Best Practices

1. Always use `docker-compose down` to clean up containers
2. Use named volumes for node_modules to improve performance
3. Keep Docker images slim by using multi-stage builds
4. Cache test results between runs where possible
5. Use the same Dockerfile for development and production to ensure consistency
