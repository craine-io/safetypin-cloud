# Frontend Decoupling

This feature branch implements a full decoupling of the frontend from AWS dependencies. The changes allow the frontend to operate completely independently from the backend implementation details.

## Changes Made

### 1. Authentication Service

- Renamed `mock-amplify.ts` to `auth-service.ts`
- Removed all AWS-specific terminology (Cognito, Amplify, etc.)
- Replaced with generic authentication service interface
- Standardized method names and parameters

### 2. API Services

- Created a clean API service layer
- Implemented server and transfer services
- Added mock data support for development
- Abstracted API calls through a consistent interface

### 3. React Hooks

- Created useServers hook for server management
- Created useTransfers hook for transfer operations
- Ensured hooks manage their own loading and error states
- Hooks provide a clean interface for components to use

### 4. Configuration

- Replaced aws-exports.js with a generic config.ts file
- Centralized app configuration in one place
- Added support for environment-specific settings
- Implemented feature flags for controlling functionality

## Benefits

1. **Independent Development**: Frontend and backend can now be developed independently
2. **Simpler Testing**: Mock implementations can be easily swapped in for testing
3. **Cleaner Architecture**: Clear separation of concerns between UI and data layers
4. **Technology Agnostic**: Backend implementation technology can change without affecting frontend
5. **Easier Onboarding**: Developers can work on the frontend without AWS knowledge

## Next Steps

1. **Split Repositories**: Move frontend and backend code to separate repositories
2. **CI/CD Setup**: Configure separate pipelines for each repository
3. **API Documentation**: Create comprehensive API documentation
4. **Environment Configuration**: Set up environment-specific configuration
5. **E2E Testing**: Implement end-to-end testing between the frontend and backend

## Implementation Notes

### Services Pattern

All services follow a consistent pattern:
- Singleton instance exported from service file
- Mock implementation for development mode
- Clear TypeScript interfaces
- Promise-based asynchronous methods

### Hooks Pattern

All hooks follow a consistent pattern:
- Loading state management
- Error handling
- Data fetching on component mount
- Methods for CRUD operations
- Automatic refreshing of data when needed

### Configuration

The configuration file centralizes all application settings:
- API endpoints and options
- Authentication configuration
- Feature flags
- Environment-specific settings

## Migration Guide

When moving from a frontend that directly uses AWS services to our decoupled approach:

1. Replace references to AWS Amplify/Cognito with the auth service
2. Replace direct API calls with service calls
3. Use the hooks in components rather than direct service calls
4. Update environment configuration

## Example Component Migration

Before:
```tsx
// Old component using AWS directly
import { API } from 'aws-amplify';

function ServerList() {
  const [servers, setServers] = useState([]);
  
  useEffect(() => {
    async function fetchServers() {
      try {
        const apiData = await API.get('safetypinApi', '/servers');
        setServers(apiData.data);
      } catch (err) {
        console.log('error fetching servers');
      }
    }
    
    fetchServers();
  }, []);
  
  return (
    // Render servers...
  );
}
```

After:
```tsx
// New component using hooks and services
import { useServers } from '../hooks/useServers';

function ServerList() {
  const { servers, loading, error } = useServers();
  
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  
  return (
    // Render servers...
  );
}
```
