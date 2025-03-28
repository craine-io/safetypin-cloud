/**
 * Database mocking utilities for tests
 */

export class MockPoolClient {
  query = jest.fn();
  release = jest.fn();
}

export class MockPool {
  query = jest.fn();
  connect = jest.fn().mockResolvedValue(new MockPoolClient());
  end = jest.fn().mockResolvedValue(undefined);
}

/**
 * Create a pre-configured mock for the database module
 */
export function mockDatabaseModule() {
  const mockPool = new MockPool();
  
  const mockDatabaseModule = {
    pool: mockPool,
    query: jest.fn((text: string, params?: any[]) => {
      return mockPool.query(text, params);
    }),
    transaction: jest.fn(async (callback) => {
      const client = new MockPoolClient();
      try {
        const result = await callback(client);
        return result;
      } finally {
        client.release();
      }
    })
  };
  
  return {
    mockDatabaseModule,
    mockPool,
    MockPoolClient
  };
}

/**
 * Set up a mock query result
 */
export function setupMockQueryResult(query: jest.Mock, pattern: string | RegExp, result: any) {
  query.mockImplementation((sql: string, params?: any[]) => {
    if (typeof pattern === 'string' && sql.includes(pattern)) {
      return result;
    } else if (pattern instanceof RegExp && pattern.test(sql)) {
      return result;
    }
    return { rows: [] };
  });
}

/**
 * Create a standardized mock row result
 */
export function createMockRowResult(rows: any[]) {
  return { rows, rowCount: rows.length };
}
