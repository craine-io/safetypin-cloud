// Application configuration

const config = {
  // API configuration
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'https://api.safetypin.example.com',
    timeout: 10000,
  },
  
  // Authentication configuration
  auth: {
    useLocalStorage: true,
    storageKeys: {
      authState: 'authState',
      userEmail: 'userEmail',
    }
  },
  
  // Feature flags
  features: {
    mockMode: process.env.REACT_APP_MOCK_MODE === 'true' || true,
    enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true' || false,
  }
};

export default config;