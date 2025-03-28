# SafetyPin Cloud - Project TODOs

## Current Status

The project is in early alpha development (v0.1.0-alpha.1-dev). We've begun implementing a type-safe approach in the Postgres repository classes to improve code quality and eliminate TypeScript errors.

## In Progress

- Implementing type-safe pattern across all repository classes
- Working on fixing TypeScript errors in the database tests
- Addressing frontend-backend integration issues

## Completed Tasks

- Added a generic type parameter `RowType` to `BasePostgresRepository` for type safety
- Created strongly-typed row interfaces for several repositories:
  - UserPostgresRepository
  - ServerPostgresRepository
  - OrganizationPostgresRepository
  - SessionPostgresRepository
  - MfaPostgresRepository
  - IdentityProviderPostgresRepository
- Updated methods to use proper type casting with these row types

## Pending Tasks

### High Priority

1. **Fix TypeScript Errors in Remaining Repositories**
   - Update the following repositories with the new type-safe approach:
     - PermissionPostgresRepository
     - CloudProviderPostgresRepository 
     - CloudCredentialPostgresRepository
     - TransferPostgresRepository

2. **Frontend-Backend Integration**
   - Investigate why the frontend isn't consuming the seeded backend data
   - Check API endpoint configurations
   - Verify CORS settings
   - Review data fetching logic in the frontend
   - Test authentication flow if applicable

### Medium Priority

1. **Testing**
   - Add comprehensive unit tests for all repositories
   - Implement integration tests for critical workflows
   - Set up CI/CD pipeline for automated testing

2. **Documentation**
   - Document the repository pattern and type-safe approach
   - Create API documentation
   - Update README with setup and development instructions

### Low Priority

1. **Performance Optimization**
   - Consider adding a caching layer
   - Optimize database queries
   - Implement connection pooling

2. **Code Quality**
   - Refactor duplicated code
   - Implement consistent error handling
   - Add more logging for debugging

## Best Practices for Repository Pattern

1. Maintain consistent type safety across all repositories
2. Keep repositories focused on data access (separation of concerns)
3. Implement thorough error handling
4. Add appropriate logging
5. Write comprehensive tests

## Notes on Type-Safe Pattern Implementation

The pattern for updating each repository should be consistent:

1. Define an interface for the database row structure that matches column names
2. Update the class extension to include the new row type parameter: 
   ```typescript
   extends BasePostgresRepository<Entity, RowType, CreateDto, UpdateDto>
   ```
3. Update the `mapToEntity` method to use the strongly-typed row: 
   ```typescript
   protected mapToEntity(row: RowType): Entity
   ```
4. Add type assertions (`as RowType`) for database rows in all methods
