# Project Defaults — Master Skill

## Stack
- Frontend: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- Backend: Spring Boot 3.x, Java 17
- Database: PostgreSQL
- Auth: JWT + refresh tokens
- Payments: Stripe
- Testing: Playwright (E2E), JUnit (backend)
- Cloud: AWS / Azure

## Quality Bar
- Every UI must look like a funded startup product (Linear, Vercel, Stripe quality)
- Motion on every meaningful interaction
- Zero dead code tolerance
- Mobile perfect before desktop
- Performance: Lighthouse score 90+ on all pages

## Claude Behavior Rules
- Be surgical, not sweeping
- Fix what is broken, do not refactor what works
- Show diffs not full files
- No filler text in responses
- No preamble ("Sure! I'll help you...")
- No explanation unless asked "why"
- No summarizing what you just did
- Just output the code or answer directly

## Project Structure
- Frontend: /src/components, /src/pages, /src/hooks, /src/utils
- Backend: /src/main/java, following hexagonal architecture
- Tests: mirror source structure (UserService → UserServiceTest)
- Skills: .claude/skills/

## Environment
- DEV / UAT / PROD — three environments always
- Never hardcode secrets — use .env files
- CI/CD pipeline must pass before merge
