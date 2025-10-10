# NEST-Haus Test Suite

## Overview

This test suite is designed to comprehensively test the NEST-Haus modular house configurator and e-commerce platform. The tests are organized by functionality and focus on the current website features.

## Test Structure

### 📁 `/website/` - Core Website Functionality

Tests for the main user-facing features of the website.

#### `landing-page.test.ts`

- Hero carousel functionality
- Navigation components
- Content sections and cards
- Mobile responsiveness
- Image optimization

#### `configurator.test.ts`

- House configuration selection
- Real-time price calculations
- Image preview system
- User experience optimizations
- Session state management

#### `contact-system.test.ts`

- Contact form validation and submission
- Inquiry management and tracking
- Google Calendar integration
- Email notifications
- GDPR compliance

#### `e-commerce.test.ts`

- Shopping cart functionality
- Checkout process
- Stripe payment integration
- Order management
- EU e-commerce compliance

#### `security.test.ts`

- Content protection measures
- Rate limiting and bot detection
- Data protection and encryption
- Threat detection and response
- Copyright protection

### 📁 `/integration/` - API and Route Testing

- `api.test.ts` - API endpoint testing
- `routes.test.ts` - Page route testing

### 📁 `/performance/` - Performance Testing

- `performance.test.ts` - Bundle size, Core Web Vitals, load times

### 📁 `/compliance/` - Code Quality Testing

- `typescript.test.ts` - TypeScript compliance and type safety

## Running Tests

### All Tests

```bash
npm run test
```

### Specific Test Categories

```bash
# Website functionality tests
npm run test src/test/website/

# Integration tests
npm run test src/test/integration/

# Performance tests
npm run test src/test/performance/

# Compliance tests
npm run test src/test/compliance/
```

### Coverage Reports

```bash
npm run test -- --coverage
```

## Test Development Guidelines

### 1. Test Organization

- Group related tests in describe blocks
- Use descriptive test names that explain the expected behavior
- Focus on user-facing functionality and business logic

### 2. Test Types

- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test API endpoints and data flow
- **Performance Tests**: Test bundle sizes and load times
- **Security Tests**: Test protection measures and compliance

### 3. Test Patterns

```typescript
describe("Feature Name", () => {
  describe("Specific Functionality", () => {
    it("should behave in expected way", () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### 4. Mocking Strategy

- Mock external services (Stripe, Google Calendar, email)
- Mock database calls for unit tests
- Use real database for integration tests
- Mock heavy components for performance tests

### 5. Test Data

- Use realistic test data that matches production scenarios
- Test edge cases and error conditions
- Include accessibility and mobile testing

## Configuration

### Vitest Configuration

The test suite uses Vitest with the following key configurations:

- **Environment**: jsdom for DOM testing
- **Setup**: Automated test environment setup
- **Coverage**: V8 provider with HTML reports
- **Timeout**: 15 seconds for integration tests

### Test Environment

- **Node.js**: Latest LTS version
- **Database**: Test database with seed data
- **External Services**: Mocked in test environment

## Continuous Integration

### Pre-commit Hooks

- Run linting and type checking
- Run unit tests
- Check test coverage thresholds

### CI Pipeline

- Run full test suite on pull requests
- Generate coverage reports
- Performance regression testing
- Security vulnerability scanning

## Test Coverage Goals

| Category          | Target Coverage |
| ----------------- | --------------- |
| Components        | 90%+            |
| API Routes        | 95%+            |
| Business Logic    | 95%+            |
| Security Features | 100%            |
| Overall           | 85%+            |

## Debugging Tests

### Common Issues

1. **Async/Await**: Ensure proper async handling in tests
2. **DOM Cleanup**: Tests should clean up after themselves
3. **Mock Isolation**: Ensure mocks don't leak between tests
4. **Environment Variables**: Set test-specific env vars

### Debug Commands

```bash
# Run tests in debug mode
npm run test -- --reporter=verbose

# Run specific test file
npm run test src/test/website/configurator.test.ts

# Run tests with coverage
npm run test -- --coverage --reporter=html
```

## Contributing

### Adding New Tests

1. Follow the existing file structure
2. Use descriptive test names
3. Include both positive and negative test cases
4. Add appropriate mocks for external dependencies
5. Update this README if adding new test categories

### Test Review Checklist

- [ ] Tests cover the main functionality
- [ ] Edge cases are tested
- [ ] Error conditions are handled
- [ ] Tests are isolated and don't depend on each other
- [ ] Appropriate mocks are used
- [ ] Tests run quickly (< 5 seconds per test)

## Future Enhancements

### Planned Additions

- Visual regression testing
- End-to-end testing with Playwright
- Load testing for high traffic scenarios
- Accessibility testing automation
- Mobile device testing

### Test Automation

- Automated test generation for new components
- Performance regression alerts
- Security vulnerability scanning
- Dependency update testing

---

_This test suite is designed to ensure the reliability, security, and performance of the NEST-Haus platform while supporting rapid development and deployment._
