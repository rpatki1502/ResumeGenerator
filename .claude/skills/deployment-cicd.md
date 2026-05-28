# Deployment & CI/CD Standards

## Environment Strategy
- DEV — feature branch deployments, experimental
- UAT/Staging — integration testing, client demos
- PROD — live users, maximum stability

## CI/CD Pipeline — Every Project Must Have

### On Pull Request
1. Lint check (ESLint / Checkstyle)
2. TypeScript type check (tsc --noEmit)
3. Unit tests (must pass 100%)
4. Integration tests (must pass 100%)
5. Code coverage check (minimum 80%)
6. Security scan (npm audit / OWASP dependency check)
7. Build verification (must compile successfully)

### On Merge to Develop
1. All PR checks above
2. Deploy to UAT automatically
3. Run E2E tests against UAT
4. Notify team on Slack/email

### On Merge to Main (Production)
1. All checks above
2. Manual approval gate required
3. Deploy to production
4. Run smoke tests post-deploy
5. Notify team on success/failure
6. Tag release with version number

## Docker
- Dockerfile for every service
- Multi-stage builds (build stage + runtime stage)
- Non-root user in containers
- .dockerignore to exclude node_modules, .env, build artifacts
- Health check endpoint: GET /health → { status: "ok" }
- Environment variables via docker-compose or Kubernetes secrets

## Cloud (AWS / Azure)
- AWS: ECS/Fargate for containers, RDS for PostgreSQL, ElastiCache for Redis
- Azure: AKS for containers, Azure Database for PostgreSQL, Azure Cache for Redis
- Load balancer in front of all services
- Auto-scaling based on CPU (scale at 70% threshold)
- CDN for all static assets (CloudFront / Azure CDN)
- S3 / Azure Blob for file storage

## Monitoring & Alerting
- Health check endpoint on every service: /health
- Uptime monitoring (alert if down > 1 min)
- Error rate monitoring (alert if > 1% error rate)
- Response time monitoring (alert if P95 > 500ms)
- Log aggregation (CloudWatch / Azure Monitor)
- Application errors to Sentry

## Rollback Strategy
- Keep last 3 production builds ready to rollback
- Rollback must be possible in under 5 minutes
- Database migrations must be backward compatible (never breaking)
- Feature flags for risky features (can disable without deploy)

## Secrets Management
- Never in code or git history
- AWS: AWS Secrets Manager or Parameter Store
- Azure: Azure Key Vault
- Local dev: .env file (in .gitignore)
- Rotate secrets quarterly minimum
