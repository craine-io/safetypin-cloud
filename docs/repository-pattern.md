# Repository Pattern Implementation Guide

## Overview

This document describes the repository pattern implementation in SafetyPin Cloud, with a focus on the type-safe approach used for database operations.

## Repository Structure

The repository layer follows a consistent pattern:

1. **Base Repository Interface**: Defines common CRUD operations
2. **PostgreSQL Implementation**: Implements the repository interface for PostgreSQL
3. **Type-Safe Row Mapping**: Uses TypeScript generics for type safety

## Base Repository Interface

The `BaseRepository<T, CreateDto, UpdateDto>` interface defines common operations:

- `findById(id: string): Promise<T | null>`
- `findAll(filter?: any, options?: QueryOptions): Promise<T[]>`
- `findOne(filter: any): Promise<T | null>`
- `count(filter?: any): Promise<number>`
- `create(dto: CreateDto): Promise<T>`
- `createMany(dtos: CreateDto[]): Promise<T[]>`
- `update(id: string, dto: UpdateDto): Promise<T | null>`
- `updateMany(filter: any, dto: Partial<UpdateDto>): Promise<number>`
- `delete(id: string): Promise<boolean>`
- `deleteMany(filter: any): Promise<number>`
- `exists(filter: any): Promise<boolean>`
- `transaction<R>(callback: (repository: BaseRepository<T, CreateDto, UpdateDto>) => Promise<R>): Promise<R>`

## PostgreSQL Implementation

The `BasePostgresRepository<T, RowType, CreateDto, UpdateDto>` class implements the BaseRepository interface for PostgreSQL:

- `T`: The entity type returned by the repository
- `RowType`: The database row type (a TypeScript interface matching the table columns)
- `CreateDto`: The data transfer object for create operations
- `UpdateDto`: The data transfer object for update operations

### Key Methods

- `protected abstract mapToEntity(row: RowType): T`: Maps database rows to entity objects
- `protected abstract mapToCreateQuery(dto: CreateDto): { query: string; params: any[] }`: Generates SQL for create operations
- `protected abstract mapToUpdateQuery(dto: UpdateDto): { setClause: string; params: any[] }`: Generates SQL for update operations
- `protected abstract getTransactionRepository(client: PoolClient): BaseRepository<T, CreateDto, UpdateDto>`: Creates a transaction-specific repository

## Type-Safe Implementation

Each repository implementation follows this pattern:

1. Define a database row interface that matches the table structure:
```typescript
interface UserRow {
  id: string;
  email: string;
  first_name: string | null;
  // other columns...
}
```

2. Extend the base repository with proper type parameters:
```typescript
export class UserPostgresRepository 
  extends BasePostgresRepository<User, UserRow, CreateUserDto, UpdateUserDto> 
  implements UserRepository 
{
  // implementation...
}
```

3. Implement the mapToEntity method with strong typing:
```typescript
protected mapToEntity(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    // map other properties...
  };
}
```

4. Use type assertions when processing database query results:
```typescript
const result = await query(/* ... */);
return result.rows.map(row => this.mapToEntity(row as UserRow));
```

## Best Practices

1. **Consistent Naming**: Use consistent naming conventions for entity properties and database columns
2. **Type Safety**: Always use the appropriate types and avoid `any` where possible
3. **Error Handling**: Implement robust error handling in repository methods
4. **Documentation**: Document repository methods, especially any complex behavior
5. **Single Responsibility**: Keep repository methods focused on data access, with business logic in services

## Example Implementation

```typescript
// Entity type
interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  // ...
}

// Database row type
interface UserRow {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  // ...
}

// Repository implementation
class UserRepository extends BasePostgresRepository<User, UserRow, CreateUserDto, UpdateUserDto> {
  constructor() {
    super('users');
  }
  
  protected mapToEntity(row: UserRow): User {
    return {
      id: row.id,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      // ...
    };
  }
  
  // Other required methods...
}
```

## Troubleshooting

Common issues when implementing repositories:

1. **Type Errors**: Ensure all generics are properly defined and all database columns are included in the row type
2. **Missing Properties**: Verify that all entity properties are mapped from database columns
3. **Transaction Handling**: Make sure transaction repositories correctly use the client for queries
