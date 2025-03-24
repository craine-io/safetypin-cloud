// Docker-specific configuration
export default {
  // When running in Docker, API calls need to use the internal service name
  apiUrl: 'http://backend:3000',
};
