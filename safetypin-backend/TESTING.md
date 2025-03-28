# Testing Guide for SafetyPin Backend

This document provides guidance on running tests and implementing Test-Driven Development (TDD) in the SafetyPin backend codebase.

## Running Tests

### Prerequisites

Make sure you have all dependencies installed:

```bash
npm install
```

### Running All Tests

```bash
npm test
```

### Running Tests with Coverage

```bash
npm test -- --coverage
```

### Running Specific Tests

```bash
# Run tests that match a pattern
npm test -- -t "UserRepository"

# Run tests in a specific file
npm test -- src/lib/repositories/__tests__/postgres/user-postgres.repository.test.ts
```

### Continuous Testing (Watch Mode)

```bash
npm test -- --watch
```

## Test Structure

The tests follow the repository structure of the codebase:

- `src/lib/repositories/__tests__/` - Repository tests
- `src/test/mocks/` - Mock objects for testing

## Writing Tests

We follow the Test-Driven Development (TDD) approach:

1. Write a failing test that defines the functionality you want to create
2. Implement the feature to make the test pass
3. Refactor your code as needed while keeping tests passing

### Example Test Template

```typescript
import { SomeClass } from '../path/to/class';

describe('SomeClass', () => {
  let instance: SomeClass;
  
  beforeEach(() => {
    // Set up your test environment
    instance = new SomeClass();
  });
  
  afterEach(() => {
    // Clean up if necessary
    jest.resetAllMocks();
  });
  
  describe('someMethod', () => {
    it('should do something when condition', () => {
      // Arrange
      const input = 'some input';
      
      // Act
      const result = instance.someMethod(input);
      
      // Assert
      expect(result).toBe('expected output');
    });
    
    it('should handle edge cases', () => {
      // Test edge cases
    });
  });
});
```

## Mocking Dependencies

Use Jest's mocking features to isolate units for testing:

```typescript
// Mock a module
jest.mock('../path/to/module', () => ({
  someFunction: jest.fn().mockReturnValue('mocked value')
}));

// Mock a specific method of an imported class
SomeClass.prototype.someMethod = jest.fn().mockResolvedValue('mocked result');

// Spy on a method
jest.spyOn(instance, 'someMethod').mockImplementation(() => 'mocked result');
```

For database operations, use the provided mock utilities in `src/test/mocks/database.mock.ts`.

## Continuous Integration

All tests are automatically run on GitHub Actions when:
- Pushing to main/develop branches
- Creating a pull request to main/develop branches

The workflow configuration is located in `.github/workflows/backend-testing.yml`.

## Code Coverage

We aim for high test coverage to ensure code quality:
- Statements: 75%
- Branches: 70%
- Functions: 75%
- Lines: 75%

Coverage reports are generated when running tests with the `--coverage` flag.
