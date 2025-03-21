# Deploying SafetyPin Frontend to AWS ECS

This guide provides instructions for deploying the SafetyPin frontend application to AWS Elastic Container Service (ECS).

## Prerequisites

- AWS CLI installed and configured
- Docker installed
- Access to an AWS account with permissions to:
  - Create/manage ECR repositories
  - Create/manage ECS clusters, services, and tasks
  - Manage IAM roles and policies
  - Configure Application Load Balancers

## Deployment Steps

### 1. Create an ECR Repository

```bash
aws ecr create-repository --repository-name safetypin-frontend --region us-east-1
```

### 2. Build and Push the Docker Image

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <your-aws-account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build the image
docker build -t safetypin-frontend .

# Tag the image
docker tag safetypin-frontend:latest <your-aws-account-id>.dkr.ecr.us-east-1.amazonaws.com/safetypin-frontend:latest

# Push the image
docker push <your-aws-account-id>.dkr.ecr.us-east-1.amazonaws.com/safetypin-frontend:latest
```

### 3. Create an ECS Cluster

You can create an ECS cluster through the AWS Management Console or AWS CLI:

```bash
aws ecs create-cluster --cluster-name safetypin-cluster
```

### 4. Create a Task Definition

Create a file named `task-definition.json`:

```json
{
  "family": "safetypin-frontend",
  "networkMode": "awsvpc",
  "executionRoleArn": "arn:aws:iam::<your-aws-account-id>:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "safetypin-frontend",
      "image": "<your-aws-account-id>.dkr.ecr.us-east-1.amazonaws.com/safetypin-frontend:latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 80,
          "hostPort": 80,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/safetypin-frontend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ],
  "requiresCompatibilities": [
    "FARGATE"
  ],
  "cpu": "256",
  "memory": "512"
}
```

Register the task definition:

```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

### 5. Create a Service

Before creating a service, you'll need:
- A VPC with at least two public subnets
- A security group for the service
- An Application Load Balancer (ALB)

Then create the service:

```bash
aws ecs create-service \
  --cluster safetypin-cluster \
  --service-name safetypin-frontend-service \
  --task-definition safetypin-frontend:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-12345678,subnet-87654321],securityGroups=[sg-12345678],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:<your-aws-account-id>:targetgroup/safetypin-frontend-tg/1234567890abcdef,containerName=safetypin-frontend,containerPort=80"
```

### 6. Set Up Continuous Deployment (Optional)

For continuous deployment, you can:

1. Use AWS CodePipeline with GitHub integration
2. Use GitHub Actions with AWS credentials (see the workflow file in `.github/workflows/`)
3. Use AWS CodeBuild for the CI/CD pipeline

## Scaling Considerations

- Configure Application Auto Scaling for the ECS service based on CPU/memory utilization
- Use a CDN like CloudFront to cache static assets
- Consider using AWS S3 for storing and serving static assets

## Monitoring

- Set up CloudWatch dashboards for monitoring ECS services
- Configure alarms for high CPU/memory usage
- Monitor the Application Load Balancer metrics

## Cost Optimization

- Use Fargate Spot for non-critical workloads
- Schedule scaling during off-peak hours
- Review and optimize resource allocation (CPU/memory)

## Security Best Practices

- Use AWS WAF with the Application Load Balancer
- Implement HTTPS with an ACM certificate
- Use IAM roles with least privilege
- Configure security groups to allow only necessary traffic
- Store secrets in AWS Secrets Manager or Parameter Store
