# Session Memory & Persistent Context
## Extracted from: breferrari/obsidian-mind + eugeniughelbur/obsidian-second-brain

---

## Session Start — Do This Every Time

At the start of every session Claude must:

1. **Ask what project we are working on today** if not clear from context
2. **Load active project context** — ask user to confirm current active projects
3. **Check for open tasks** from previous session — ask "Any carry-overs from last time?"
4. **Read North Star** — ground all suggestions in current goals:
   - CareervyAI: approaching private beta launch (30 users)
   - Java Backend work: Senior Backend Developer role
   - Client projects: retail websites, web apps, coding platforms
5. **Remind user of key decisions** made in recent sessions if relevant

## Session End — Wrap Up Protocol

When user says "wrap up", "done for today", "that's it", or similar — automatically run this:

1. **Summarize what was accomplished** this session in 3-5 bullet points
2. **List decisions made** this session (architecture, tech choices, approaches)
3. **List open items** not completed — carry forward to next session
4. **Highlight wins** — what shipped, what improved, what was fixed
5. **Suggest next steps** for the next session based on what was done
6. **Flag any gotchas** discovered — things that could trip up future work

---

## Memory Rules — How Claude Should Remember Things

### When User Says "Remember This"
- Acknowledge immediately: "Got it — remembered for this project"
- Restate what was remembered so user can confirm
- Apply it for the rest of the session automatically
- Reference it proactively when relevant later in the session

### Decision Records — Always Capture
When a significant technical decision is made, log it immediately:
```
DECISION: [what was decided]
CONTEXT: [why this decision was needed]
CHOSEN: [what was chosen]
REJECTED: [alternatives considered]
REASON: [why this was chosen over alternatives]
DATE: [today's date]
```

### Patterns & Gotchas — Flag These
- When a recurring problem is solved: note the pattern
- When something unexpected fails: note the gotcha
- When a workaround is found: note it for future use
- Proactively mention patterns from earlier in session when relevant

---

## Project Context — Load Per Project

### CareervyAI
- Desktop app, Anthropic API, SSE streaming
- Stripe 9-SKU pricing (interview packs, resume packs, bundles)
- PostgreSQL with RLS, JWT auth
- Three envs: DEV / UAT / PROD
- Current stage: private beta prep (30 users)
- Security score: 7.5/10 — maintain, do not regress
- Voice: Maya (MediaRecorder + Groq Whisper)
- Deferred: code signing, stealth process name

### Java Backend Work
- Spring Boot 3.x, Java 17
- Kafka event-driven microservices
- AWS infrastructure
- Senior Backend Developer role

### Client Projects
- Retail websites and ecommerce apps
- Coding platforms and web apps
- Stack: Next.js, TypeScript, Tailwind, Spring Boot

---

## Context Management Rules

### Before Starting Any Task
- Check: "Have we already built something similar in this project?"
- Check: "Does this conflict with any decision already made?"
- Check: "Is this consistent with the project's architecture?"

### During a Task
- If scope creep detected: flag it immediately — "This is expanding beyond the original ask, should I continue?"
- If a better approach exists: mention it once, then do what was asked unless told otherwise
- If a previous decision is being contradicted: say "Earlier we decided X — this would change that. Intentional?"

### Across Sessions — Re-establish Context Fast
When starting a new chat about an ongoing project, ask user to confirm:
1. Which project: CareervyAI / Java work / Client project (which client)?
2. What was last worked on?
3. Any blockers or changes since last session?
4. What is the goal for this session?

This takes 30 seconds and saves 30 minutes of re-explanation.

---

## Knowledge Categories — What to Track

### Decisions (high value — always track)
- Architecture choices (why Spring Boot not Node, why PostgreSQL not MongoDB)
- Tech stack choices per project
- Security decisions and tradeoffs
- Pricing and business decisions (CareervyAI SKUs, tier structure)

### Patterns (high value — reuse across sessions)
- Code patterns that worked well
- Prompt patterns that got good results
- Debugging approaches that solved tricky bugs
- Performance optimizations that worked

### Gotchas (high value — avoid repeating mistakes)
- Things that looked right but broke in production
- Edge cases that were discovered the hard way
- Third-party API quirks (Stripe webhook timing, Anthropic rate limits)
- Environment-specific issues (DEV vs PROD differences)

### Active Tasks (session level — clear each session)
- What is in progress right now
- What is blocked and why
- What needs review or testing
- What needs to be deployed

---

## Anti-Patterns to Avoid

- Never start a session by asking "how can I help you today?" — ask about the project instead
- Never forget a decision made earlier in the same session
- Never suggest an approach that contradicts a decision already made without flagging the conflict
- Never let the user re-explain the same context they already gave
- Never scope-creep silently — always flag when expanding beyond the ask
- Never end a session without a wrap-up summary if substantial work was done
