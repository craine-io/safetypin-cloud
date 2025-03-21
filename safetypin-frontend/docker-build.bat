@echo off
echo Building SafetyPin Frontend Docker image...

REM Build the Docker image
docker build -t safetypin-frontend:latest .

REM Run the container
docker run -d -p 3000:80 --name safetypin-frontend safetypin-frontend:latest

echo SafetyPin Frontend is running at http://localhost:3000
