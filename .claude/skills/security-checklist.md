# Security Checklist — Every Project

## Authentication & Authorization
- JWT access token: 15 min expiry
- JWT refresh token: 7 days expiry, rotate on use
- BCrypt password hashing (strength 12 minimum)
- Account lockout after 5 failed login attempts (15 min lockout)
- Secure password reset via time-limited tokens (15 min)
- Email verification on registration
- @PreAuthorize on all sensitive endpoints
- Role-based access control (RBAC) enforced at service layer

## Input Validation — Every Endpoint
- Validate ALL user inputs server-side (never trust client)
- Sanitize all string inputs (strip HTML tags)
- Validate file uploads: type, size, content (not just extension)
- Max file upload size: 10MB default
- Whitelist allowed file types — never blacklist
- Validate request body size limits
- Use @Valid + Bean Validation annotations (Spring Boot)

## API Security
- Rate limiting on all public endpoints
- Rate limit login endpoint: 5 attempts per 15 min per IP
- Rate limit registration: 3 per hour per IP
- CORS configured explicitly — no wildcard (*) in production
- HTTPS only — redirect HTTP to HTTPS
- Security headers: HSTS, CSP, X-Frame-Options, X-Content-Type-Options
- Remove server version headers

## Data Security
- Never hardcode secrets, passwords, API keys
- All secrets in environment variables or secrets manager
- Never log passwords, tokens, credit card numbers, PII
- Encrypt sensitive data at rest (PII, payment info)
- Use Stripe — never store card data yourself
- Mask sensitive data in logs (show last 4 of card, partial email)
- GDPR compliance: right to delete, data export

## Dependency Security
- Run npm audit / mvn dependency-check regularly
- No dependencies with known critical CVEs
- Lock dependency versions (package-lock.json, pom.xml)
- Update dependencies monthly minimum
- Remove unused dependencies

## Infrastructure Security
- Row Level Security (RLS) on PostgreSQL — users see only their data
- Database not publicly accessible (VPC/private network)
- Principle of least privilege for DB users
- Rotate credentials quarterly
- Webhook signature verification (Stripe-Signature, GitHub-Signature)
- Idempotency keys on all webhook handlers

## Frontend Security
- Never store JWT in localStorage — use httpOnly cookies or memory
- Sanitize all rendered user content (prevent XSS)
- Content Security Policy (CSP) headers
- No sensitive data in URL parameters
- HTTPS everywhere — no mixed content

## Pre-Launch Security Checklist
- [ ] All secrets in environment variables (not in code)
- [ ] HTTPS configured and enforced
- [ ] CORS whitelist configured for production domains only
- [ ] Rate limiting active on all public endpoints
- [ ] Input validation on all endpoints
- [ ] SQL injection impossible (parameterized queries)
- [ ] XSS prevention active (sanitized outputs)
- [ ] Authentication on all protected routes
- [ ] Webhook signatures verified
- [ ] Dependency vulnerabilities checked
- [ ] Error messages don't expose system details
- [ ] Logging configured (no sensitive data in logs)
