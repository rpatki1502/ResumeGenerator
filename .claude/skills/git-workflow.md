# Git Workflow Standards

## Branch Strategy
- main — production only, protected branch
- staging — UAT environment, protected branch
- develop — integration branch
- feature/description — new features
- fix/description — bug fixes
- hotfix/description — critical production fixes
- chore/description — dependencies, config, tooling

## Branch Rules
- Never commit directly to main or staging
- Branch from develop for features and fixes
- Hotfixes branch from main
- Branch names: lowercase, hyphens not underscores

## Commit Messages
- Present tense, imperative mood
- "Add user authentication" not "Added user authentication"
- Format: {type}: {description}
  - feat: Add product search
  - fix: Resolve cart not updating on quantity change
  - chore: Update dependencies
  - docs: Update API documentation
  - refactor: Extract payment service
  - test: Add integration tests for checkout
  - style: Fix button alignment on mobile
- Max 72 characters in subject line
- No period at end of subject line

## Pull Requests
- PRs must be small and focused — one concern per PR
- Max 400 lines changed per PR (split larger changes)
- PR title follows commit message format
- PR description: what changed + why + how to test
- At least 1 approval before merge
- All CI checks must pass before merge
- Squash merge to keep main history clean

## Code Review
- Review within 24 hours
- Review for: correctness, security, performance, readability
- Be specific in comments — not just "this is wrong"
- Approve when: all concerns addressed, no blockers
- Use suggested changes for small fixes

## Environment Flow
- DEV: feature branches → automatic deploy
- UAT/Staging: develop branch → automatic deploy
- PROD/Main: staging → manual approval → deploy

## Tags & Releases
- Tag every production release: v{major}.{minor}.{patch}
- Semantic versioning: MAJOR.MINOR.PATCH
- Release notes with every tag
- Hotfixes increment patch: v1.2.3 → v1.2.4
