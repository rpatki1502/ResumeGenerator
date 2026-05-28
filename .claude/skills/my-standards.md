# My Personal Coding Standards

## Code Style
- Clean code, no comments unless complex logic
- Meaningful variable names, no abbreviations
- Functions do ONE thing only
- Max 20 lines per function
- No magic numbers — name them as constants
- No any types in TypeScript

## Error Handling
- Never swallow exceptions silently
- Always log with context (include request ID, user ID where relevant)
- User-facing errors are friendly messages
- Technical errors go to logs only
- Always use GlobalExceptionHandler pattern (Spring Boot)

## Security — Non-Negotiable
- Never hardcode secrets or API keys
- Always sanitize and validate user inputs
- HTTPS everywhere
- Rate limiting on all public endpoints
- JWT validation on all protected routes
- Input validation on every API endpoint

## Performance
- Lazy load images always
- Paginate all list endpoints (default page size: 20)
- Cache expensive queries (Redis)
- No N+1 queries ever
- Indexes on all foreign keys

## Architecture
- Follow hexagonal architecture for backend
- Services follow single responsibility principle
- Repository pattern for all DB access
- DTOs for all API request/response — never expose entities directly

## Git
- Feature branches: feature/description
- Bug branches: fix/description
- Commit messages: present tense, imperative ("Add user auth" not "Added user auth")
- PRs must be small and focused — one concern per PR
