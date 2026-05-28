# Backend — Spring Boot Standards

## Stack
- Spring Boot 3.x, Java 17
- PostgreSQL with JPA/Hibernate
- Redis for caching and sessions
- Kafka for event-driven communication
- JWT for authentication
- Maven for build management

## API Design
- REST APIs follow /api/v1/ convention
- All responses use standard wrapper:
  {
    "success": true/false,
    "data": {},
    "message": "string",
    "error": null
  }
- HTTP status codes must be correct (200, 201, 400, 401, 403, 404, 500)
- Always version APIs (/api/v1/, /api/v2/)

## Architecture — Hexagonal
- Controller → Service → Repository layers strictly
- No business logic in controllers
- No DB queries in controllers
- DTOs for all request/response objects
- Mappers for entity ↔ DTO conversion
- Domain models separate from persistence models

## Kafka
- Producers must include idempotency keys
- Consumers must be idempotent
- Dead Letter Queue (DLQ) for failed messages
- Always handle poison pill messages without blocking partition
- Use consumer groups per microservice

## Database
- Always use migrations (Flyway) — never alter tables directly
- Indexes on all foreign keys
- Soft deletes (deleted_at timestamp) not hard deletes
- Row Level Security (RLS) enabled on PostgreSQL
- No raw SQL unless absolutely necessary — use JPA

## Security
- JWT access token: 15 min expiry
- JWT refresh token: 7 day expiry
- BCrypt for password hashing (strength 12)
- @PreAuthorize on all sensitive endpoints
- CORS configured explicitly — no wildcard in production

## Error Handling
- Global exception handler for all uncaught exceptions
- Custom exception classes per domain
- Never expose stack traces to clients
- Log all exceptions with correlation ID

## Testing
- Unit tests for all service layer methods (JUnit 5 + Mockito)
- Integration tests for all API endpoints (Spring Boot Test)
- Minimum 80% code coverage
- Test file mirrors source: UserService.java → UserServiceTest.java
