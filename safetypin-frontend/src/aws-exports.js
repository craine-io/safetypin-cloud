// Mock AWS configuration
const awsExports = {
  // Empty configuration since we're skipping AWS implementation
  aws_project_region: 'us-east-1',
  aws_cognito_identity_pool_id: 'mock-identity-pool-id',
  aws_cognito_region: 'us-east-1',
  aws_user_pools_id: 'mock-user-pools-id',
  aws_user_pools_web_client_id: 'mock-web-client-id',
};

export default awsExports;