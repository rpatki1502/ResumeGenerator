# Testing Standards

## Philosophy
- Tests are not optional — they are part of the feature
- Write tests as you build, not after
- Minimum 80% code coverage — no exceptions
- Tests must be fast, isolated, and repeatable

## Backend Testing (Java/Spring Boot)

### Unit Tests (JUnit 5 + Mockito)
- Unit tests for ALL service layer methods
- Mock all dependencies (repositories, external services)
- Test file mirrors source: UserService.java → UserServiceTest.java
- Test method naming: should_{expectedResult}_when_{condition}
  Example: should_ThrowException_when_UserNotFound
- One assertion concept per test method
- Arrange-Act-Assert (AAA) pattern always

### Integration Tests (Spring Boot Test)
- Integration tests for ALL API endpoints
- Use @SpringBootTest + @AutoConfigureMockMvc
- Test happy path + all error cases
- Test authentication/authorization on protected endpoints
- Use @Transactional to rollback DB after each test
- Separate test database (H2 or TestContainers PostgreSQL)

### Coverage Requirements
- Service layer: 90%+ coverage
- Controller layer: 80%+ coverage
- Repository layer: 70%+ coverage (integration tests cover this)
- Overall: 80% minimum

## Frontend Testing (Playwright + TypeScript)

### E2E Tests (Playwright)
- E2E tests for all critical user journeys
- Critical paths to always test:
  - User registration and login
  - Core feature happy path
  - Checkout flow (for ecommerce)
  - Payment flow (for paid features)
- Test file naming: {feature}.spec.ts
- Page Object Model (POM) pattern for maintainability
- Tests run on Chrome, Firefox, Mobile Safari

### Component Tests
- Unit test complex components with React Testing Library
- Test user interactions not implementation details
- Mock API calls with MSW (Mock Service Worker)

## Test Data
- Never use production data in tests
- Factories/builders for test data creation
- Seed data scripts for E2E tests
- Clean up test data after test runs

## CI/CD Integration
- All tests must pass before merge to main
- Unit + integration tests run on every PR
- E2E tests run on merge to main before deploy
- Test results published as PR comments
- Failing tests block deployment — no exceptions

## Performance Testing
- Load tests for critical API endpoints (JMeter)
- Baseline: API response < 200ms at normal load
- Stress test: API must handle 10x normal traffic
- Run performance tests before major releases
