# Decision Tracking & Knowledge Management
## Extracted from: breferrari/obsidian-mind + eugeniughelbur/obsidian-second-brain

---

## Why This Matters
Every project accumulates decisions, patterns, and gotchas.
Without tracking them, you re-make the same decisions, repeat the same mistakes, and waste tokens re-explaining context.
This skill tells Claude how to capture and reuse knowledge within and across sessions.

---

## Decision Log Format
When a significant decision is made, Claude captures it in this format immediately:

```markdown
## DECISION: [Short title]
- **Date**: YYYY-MM-DD
- **Project**: CareervyAI / Java Backend / [Client name]
- **Context**: Why this decision was needed
- **Options considered**:
  1. Option A — pros/cons
  2. Option B — pros/cons
- **Chosen**: Option X
- **Reason**: Why this over alternatives
- **Tradeoffs accepted**: What we gave up
- **Review trigger**: When to revisit this decision
```

### Decisions Always Worth Logging
- Architecture choices (monolith vs microservices, sync vs async)
- Database schema changes (especially irreversible ones)
- Security model choices (auth approach, data access patterns)
- Third-party service selections (why Stripe not Paddle, why AWS not Azure)
- API design choices (REST vs GraphQL, versioning strategy)
- Performance tradeoffs (cache TTL, pagination size, lazy vs eager loading)
- Deferred items (what was intentionally NOT done and why)

---

## Pattern Library — Reusable Solutions

When a good solution is found, Claude notes it as a pattern:

```markdown
## PATTERN: [Short descriptive name]
- **Problem**: What problem this solves
- **Solution**: How it solves it
- **Code/Example**: Snippet if applicable
- **When to use**: Conditions where this applies
- **When NOT to use**: Conditions where this fails
- **First used in**: Which project/feature
```

### Examples of Patterns Worth Capturing
- Stripe webhook idempotency pattern
- SSE streaming error recovery pattern
- Spring Boot global exception handler pattern
- JWT refresh token rotation pattern
- React Query optimistic update pattern
- Kafka poison pill handling pattern

---

## Gotcha Log — Avoid Repeating Mistakes

When something unexpected breaks or surprises, Claude logs it:

```markdown
## GOTCHA: [Short descriptive name]
- **Symptom**: What went wrong / what was observed
- **Root cause**: Why it happened
- **Fix**: What resolved it
- **Prevention**: How to avoid this in future
- **Affects**: Which projects / environments
```

### Gotchas Always Worth Capturing
- Production bugs that weren't caught in testing
- Third-party API behavior that differed from docs
- Environment differences (works in DEV, breaks in PROD)
- Race conditions or timing issues
- Data edge cases that caused failures
- Security vulnerabilities discovered

---

## Research & Investigation Protocol
Extracted from obsidian-second-brain's vault-first research approach

### Before Searching Externally — Check What You Know First
1. What has already been decided about this topic in this project?
2. Has this problem been solved before in this codebase?
3. Is there a pattern already established that applies?
4. What constraints exist that affect the solution?

### When Researching a New Problem
1. **Define the problem precisely** — one sentence
2. **State the constraints** — what solutions are ruled out and why
3. **Check existing patterns** — does something similar already exist?
4. **Research** — then find solutions
5. **Evaluate against constraints** — filter options
6. **Recommend** — one clear recommendation with reasoning
7. **Log the decision** — capture what was chosen and why

### Contradictions — Surface Them Immediately
If research or context contradicts a previous decision:
- Stop immediately
- State the contradiction: "Earlier we decided X. New information suggests Y. These conflict."
- Ask: "Do you want to revisit the earlier decision or proceed knowing this conflict?"
- Never silently ignore a contradiction
- Never proceed past a contradiction without explicit confirmation

---

## Active Project State Template
Use this at session start to quickly re-establish context:

```markdown
## Active Project State: [Project Name]
**Last updated**: [Date]

### What we are building
[1-2 sentences on current feature/task]

### Current status
- ✅ Completed: [list]
- 🔄 In progress: [list]
- ⏸️ Blocked: [list + blocker]
- 📋 Next up: [list]

### Key decisions in effect
- [Decision 1 summary]
- [Decision 2 summary]

### Active gotchas to watch
- [Gotcha 1]
- [Gotcha 2]

### Deferred items (intentionally not done)
- [Item + reason deferred]
```

---

## Cross-Project Knowledge Sharing

### Patterns That Apply to ALL Projects
When a pattern is found to work across multiple projects, elevate it to a global skill file.
Examples already elevated from your work:
- Security checklist (security-checklist.md)
- Token efficiency (token-efficiency.md)
- Clean code standards (clean-code.md)
- Git workflow (git-workflow.md)

### Project-Specific Knowledge
Keep in project-specific notes:
- CareervyAI specific decisions → careervyai-project.md
- Per-client project decisions → client name in decision log
- Per-feature gotchas → feature name in gotcha log

---

## Session Intelligence Rules

### Proactive Pattern Matching
- When user describes a problem: check if a pattern already exists for it before researching
- When user is about to make a decision: mention relevant past decisions in this domain
- When user asks about a third-party service: mention any gotchas already logged for it

### Scope Awareness
- Track what was asked at the start of the session
- Flag when work is drifting from original goal
- Summarize progress against original goal when wrapping up

### Contradiction Detection
- Keep a mental model of decisions made this session
- Flag any new request that contradicts a decision made this session
- Never silently do something that undoes previous work without flagging it
