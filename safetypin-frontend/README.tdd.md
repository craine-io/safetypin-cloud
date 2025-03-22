# SafetyPin Frontend TDD Workflow

This document outlines the Test-Driven Development (TDD) workflow for the SafetyPin frontend.

## Prerequisites

- Node.js 18+
- npm 9+
- Docker and Docker Compose (optional, for containerized testing)

## TDD Workflow

1. **Write a failing test**: Create a test for functionality you want to implement
2. **Run the test to see it fail**: Confirm the test fails for the expected reason
3. **Write the minimum code to make the test pass**
4. **Run the test to see it pass**
5. **Refactor**: Clean up the code while keeping the tests passing
6. **Repeat**: Move on to the next feature/test

## Available Test Commands

### Local Machine

```bash
# Install dependencies
npm ci

# Run tests once
npm test

# Run tests with coverage
npm run test:ci

# Run tests in watch mode (development)
npm run test:watch

# Run end-to-end tests (Cypress)
npm run cypress:run

# Start Cypress interactive mode
npm run cypress:open

# Run linting
npm run lint
```

### Using Docker

```bash
# Run tests once in Docker
docker-compose -f docker-compose.test.yml run --rm test

# Run tests in watch mode in Docker
docker-compose -f docker-compose.test.yml run --rm test:watch

# Run e2e tests in Docker
docker-compose -f docker-compose.test.yml up -d app
docker-compose -f docker-compose.test.yml run --rm cypress
docker-compose -f docker-compose.test.yml down
```

### Using Make

```bash
# Run tests
make test

# Run tests in watch mode
make test-watch

# Run tests with Docker
make docker-test

# Run e2e tests with Docker
make docker-e2e
```

## Test Structure

- Unit tests: `src/__tests__/` - mirrors the structure of `src/`
- E2E tests: `cypress/e2e/`

## Testing Framework & Libraries

- **Jest**: Unit and integration testing
- **React Testing Library**: Component testing
- **Cypress**: End-to-end testing
- **ESLint with Jest plugin**: Code quality
- **Husky + lint-staged**: Pre-commit hooks

## Best Practices

1. **Test Coverage**: Aim for 80% coverage for critical code paths
2. **Component Testing**: Test behavior, not implementation
3. **Mock External Dependencies**: Use Jest mocks for APIs, router, etc.
4. **E2E Testing**: Focus on critical user flows
5. **Run Tests Locally**: Always run tests before pushing code
6. **CI Integration**: Tests run automatically in CI pipeline

## Debugging Tests

### Jest Tests

- Add `.only` to focus on a specific test: `it.only('test case', () => {})`
- Use `console.log()` for debugging
- Run with `--verbose` for detailed output

### Cypress Tests

- Use `cy.debug()` to pause execution
- Use Cypress interactive mode (`cypress open`) for step-by-step debugging
- View screenshots and videos in `cypress/screenshots` and `cypress/videos`

## Continuous Integration

The CI pipeline automatically runs:
1. Linting
2. Unit and integration tests
3. End-to-end tests
4. Build verification

Failed tests prevent merging to protected branches.
