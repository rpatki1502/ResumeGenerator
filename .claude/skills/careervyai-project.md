# CareervyAI — Project Specific Standards

## Project Overview
- Desktop application powered by Anthropic API
- AI-powered career assistant (resume, interview, job search)
- Stack: Spring Boot backend + Electron/Desktop frontend
- Anthropic API with SSE streaming
- Stripe for payments (9 SKUs: interview packs, resume packs, bundles)

## Architecture
- Three environments: DEV / UAT / PROD
- Backend: Spring Boot 3.x, Java 17
- AI: Anthropic API (claude-sonnet-4-20250514)
- Payments: Stripe with webhook idempotency
- DB: PostgreSQL with Row Level Security
- Auth: JWT + refresh tokens
- Voice: MediaRecorder + Groq Whisper (AI Trainer "Maya")

## Anthropic API Integration
- Always use claude-sonnet-4-20250514 model
- max_tokens: 1000 default (adjust per feature)
- SSE streaming for real-time responses
- Handle stream errors gracefully with retry logic
- System prompts per feature module
- Never expose API key in frontend

## Stripe Integration
- 9 SKUs: interview packs, resume packs, bundles
- Webhook idempotency: store Stripe event ID before processing
- Verify Stripe-Signature on every webhook
- Handle these events:
  - payment_intent.succeeded → activate SKU
  - payment_intent.payment_failed → notify user
  - customer.subscription.deleted → revoke access
- Never process same event twice (idempotency check first)

## Feature Modules
- Resume Builder: AI-powered resume tailoring
- Interview CoPilot: real-time interview assistance
- AI Trainer "Maya": voice-based mock interviews (Groq Whisper)
- Job Search: automated job matching
- Visa Intelligence: DOL/BLS wage data integration
- DSA + AI/ML Visualizer: coding interview prep

## Security — Critical Items
- Privilege escalation prevention (resolved — maintain)
- XSS vectors blocked (resolved — maintain)
- Row Level Security on all user tables (active — never disable)
- Webhook idempotency bugs (resolved — maintain)
- Code signing: deferred (add before public launch)
- Stealth process name: deferred

## Launch Checklist
- [ ] LLC formation complete
- [ ] Mercury bank account
- [ ] careervy.ai domain configured
- [ ] 30-user private beta
- [ ] All 3 environments running
- [ ] CI/CD pipelines active
- [ ] Stripe live keys configured
- [ ] Security score 7.5/10 maintained
- [ ] Marketing agency engaged for public launch

## Pricing Structure
- Interview packs (multiple tiers)
- Resume packs (multiple tiers)
- Bundles (interview + resume)
- Implement across: Stripe, backend, frontend — all three must be in sync

## Code Patterns — CareervyAI Specific
- All AI responses stream via SSE
- Always show streaming indicator to user
- Handle partial stream failures with resume capability
- Rate limit AI calls per user per day
- Log all AI interactions for debugging (no PII in logs)
- Feature flag system for enabling/disabling modules per user tier
