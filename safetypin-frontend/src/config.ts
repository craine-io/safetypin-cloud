// Application configuration
import apiConfig from './docker-config';

const isRunningInDocker = process.env.REACT_APP_RUNTIME_ENV === 'docker';

const config = {
  // API configuration
  api: {
    baseUrl:
      process.env.REACT_APP_API_URL ||
      (isRunningInDocker ? apiConfig.apiUrl : 'http://localhost:3000'),
    timeout: 30000, // 30 seconds
    retry: 3,
  },

  // Authentication configuration
  auth: {
    region: process.env.REACT_APP_AUTH_REGION || 'us-east-1',
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID,
  },

  // SFTP server configuration
  sftp: {
    defaultRegion: 'us-east-1',
    availableRegions: [
      { value: 'us-east-1', label: 'US East (N. Virginia)' },
      { value: 'us-west-1', label: 'US West (N. California)' },
      { value: 'eu-west-1', label: 'EU (Ireland)' },
      { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)' },
    ],
    storageSizes: [
      { value: '1', label: '1 GB' },
      { value: '5', label: '5 GB' },
      { value: '10', label: '10 GB' },
      { value: '25', label: '25 GB' },
      { value: '50', label: '50 GB' },
      { value: '100', label: '100 GB' },
    ],
  },
};

export default config;
