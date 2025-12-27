# URL Feature Test Suite

This directory contains comprehensive unit tests for the URL feature controllers, following JavaScript testing best practices.

## Test Structure

### Files Overview

- **`test-utils.ts`** - Test utilities, mocks, and data factories
- **`api.controllers.test.ts`** - Unit tests for API controllers
- **`public.controllers.test.ts`** - Unit tests for public controllers  
- **`ui.controllers.test.ts`** - Unit tests for UI controllers
- **`integration.test.ts`** - Integration tests and edge case scenarios

### Test Categories

#### 1. API Controllers (`api.controllers.test.ts`)
Tests for the API endpoints that handle URL operations:
- `getShortUrlInfo` - Retrieving URL information
- `createUrl` - Creating new URLs
- `deleteUrl` - Deleting URLs
- `updateUrl` - Updating existing URLs
- `getUrlClickCounts` - Getting click statistics

#### 2. Public Controllers (`public.controllers.test.ts`)
Tests for public endpoints:
- `getOriginalUrl` - Resolving short URLs to original URLs

#### 3. UI Controllers (`ui.controllers.test.ts`)
Tests for UI-specific endpoints:
- `createUrl` - Creating URLs with session handling
- `getAllUrls` - Getting all user URLs
- `getUrlsPage` - Paginated URL retrieval
- `deleteUrl` - Deleting URLs from UI
- `updateUrl` - Updating URLs from UI

#### 4. Integration Tests (`integration.test.ts`)
Comprehensive tests covering:
- Error handling scenarios
- Edge cases and boundary conditions
- Security and validation scenarios
- Concurrent operations
- Performance and resource management

## Test Best Practices Applied

### 1. Test Structure (AAA Pattern)
All tests follow the Arrange-Act-Assert pattern:
```typescript
it('When valid input is provided, should return expected result', async () => {
  // Arrange
  const input = createTestData();
  mockService.method.mockResolvedValue(expectedResult);

  // Act
  await controller.method(request, response);

  // Assert
  expect(mockService.method).toHaveBeenCalledWith(input);
  expect(response.json).toHaveBeenCalledWith(expectedResponse);
});
```

### 2. Descriptive Test Names
Test names include three parts:
- **What** is being tested (method/function)
- **Under what circumstances** (scenario/condition)
- **Expected result** (outcome)

Examples:
- `When valid alias and domain are provided, should return URL information successfully`
- `When URL is not found, should throw URLNotFoundException`
- `When user is not authenticated, should pass undefined user_id to service`

### 3. Test Data Factories
Using realistic test data factories instead of hardcoded values:
```typescript
export const createTestUrl = (overrides = {}) => ({
  id: 1,
  alias: 'test-alias',
  domain: 'mukhtasar.pro',
  original_url: 'https://example.com',
  user_id: 1,
  analytics_enabled: true,
  created_at: '2024-01-01T00:00:00Z',
  short_url: 'https://mukhtasar.pro/test-alias',
  description: 'Test URL',
  ...overrides,
});
```

### 4. Comprehensive Mocking
All external dependencies are properly mocked:
- URL service functions
- Redis client operations
- Database repository methods
- ID generator functions

### 5. Error Testing
Tests cover various error scenarios:
- Validation errors
- Conflict errors
- Not found errors
- Unexpected errors

### 6. Edge Case Coverage
Tests include boundary conditions:
- Maximum length inputs
- Large numbers
- Empty/null values
- Special characters
- Concurrent operations

## Running Tests

### Available Scripts

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run only URL feature tests
npm run test:url

# Run URL tests in watch mode
npm run test:url:watch
```

### Test Configuration

Tests are configured using Jest with:
- TypeScript support via `ts-jest`
- ESM module support
- Path mapping for internal modules
- Coverage thresholds (80% minimum)
- Custom setup file for global test utilities

## Coverage Goals

The test suite aims for:
- **80%+ code coverage** across all metrics
- **100% coverage** of critical paths
- **Comprehensive error handling** coverage
- **Edge case coverage** for security and reliability

## Test Data Guidelines

### Realistic Input Data
- Use realistic URLs (not just "foo" or "test")
- Include various URL formats (HTTP, HTTPS, with paths, query params)
- Test with Arabic characters and special encoding
- Include edge cases like very long URLs

### User Scenarios
- Authenticated users vs guest users
- Different user permissions
- Session handling scenarios
- Pagination with various page sizes

### Error Scenarios
- Invalid input formats
- Missing required fields
- Resource conflicts
- Network/service failures

## Maintenance Guidelines

### Adding New Tests
1. Follow the AAA pattern
2. Use descriptive test names
3. Include both positive and negative test cases
4. Test edge cases and boundary conditions
5. Update test utilities if needed

### Updating Existing Tests
1. Maintain backward compatibility
2. Update mocks when service interfaces change
3. Ensure test data remains realistic
4. Update error scenarios as needed

### Test Performance
- Keep tests fast (< 100ms per test)
- Use proper mocking to avoid external dependencies
- Clean up after each test
- Avoid unnecessary setup/teardown

## Debugging Tests

### Enable Debug Output
Set environment variable to see console output:
```bash
DEBUG_TESTS=true npm test
```

### Common Issues
1. **Mock not working**: Ensure mocks are set up before each test
2. **Async issues**: Use proper async/await patterns
3. **Type errors**: Check import paths and type definitions
4. **Coverage gaps**: Add tests for uncovered code paths

This test suite provides comprehensive coverage of the URL feature controllers while following industry best practices for maintainable and reliable testing.
