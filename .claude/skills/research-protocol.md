# Research & Deep Investigation Protocol
## Extracted from: eugeniughelbur/obsidian-second-brain + breferrari/obsidian-mind

---

## Philosophy
Before searching the web or generating answers from training data:
1. Check what is already known from this project's context
2. Check if a decision has already been made that constrains the answer
3. Only then research externally
4. Always surface contradictions between new findings and existing decisions

---

## Research Modes

### Mode 1: Quick Lookup
**When to use**: Syntax, API reference, specific fact
**Protocol**:
- Answer directly from knowledge
- Flag if information might be outdated (anything post mid-2025)
- Cite source type (docs, known pattern, training data)

### Mode 2: Decision Research
**When to use**: Choosing between approaches, evaluating tech options, architecture decisions
**Protocol**:
1. State the decision to be made in one sentence
2. List all constraints (must use X, cannot use Y, budget Z, timeline W)
3. List options (max 3 — if more exist, narrow to top 3)
4. For each option: pros, cons, fits constraints? (yes/no)
5. Recommend one option with clear reasoning
6. Note what is being traded off
7. Log as a DECISION record

### Mode 3: Deep Investigation
**When to use**: Complex bug, performance issue, security concern, architecture review
**Protocol**:
1. **Define**: What exactly is the problem? (1 sentence)
2. **Symptoms**: What is observed vs what is expected?
3. **Hypotheses**: List 2-3 possible root causes (ranked by likelihood)
4. **Investigate**: Check most likely hypothesis first
5. **Findings**: What did investigation reveal?
6. **Root cause**: Confirmed root cause (not symptom)
7. **Fix**: Surgical fix for root cause
8. **Prevention**: How to prevent recurrence
9. **Log as GOTCHA** if it could affect future work

### Mode 4: Competitive/Market Research
**When to use**: CareervyAI feature decisions, pricing research, positioning
**Protocol**:
1. Define research question precisely
2. Identify 3-5 comparable products/approaches
3. For each: what they do, pricing, strengths, weaknesses
4. Synthesize: what does this mean for our decision?
5. Recommend: based on findings, what should we do?
6. Log decision if a choice is made

---

## Investigation Checklist — Before Diagnosing a Bug

### Information to Gather First
- [ ] What is the exact error message or unexpected behavior?
- [ ] What environment? (DEV / UAT / PROD)
- [ ] When did it start? (after which change?)
- [ ] Is it reproducible? Every time or intermittent?
- [ ] What is the expected behavior?
- [ ] What has already been tried?

### Root Cause Categories (check in order)
1. **Data issue** — bad input, null values, type mismatch
2. **Logic issue** — wrong condition, off-by-one, wrong operator
3. **Integration issue** — API contract mismatch, version incompatibility
4. **Environment issue** — config difference, missing env var, permission
5. **Race condition** — timing, async, concurrent access
6. **Infrastructure issue** — memory, CPU, network, disk

### Investigation Rules
- Fix the ROOT CAUSE, never the symptom
- One fix at a time — never change multiple things simultaneously when debugging
- Verify the fix actually resolved the issue before closing
- Check if the same root cause exists elsewhere in the codebase

---

## Asking Good Questions — Before Researching

### The 5 Questions to Answer Before Searching
1. What exactly do I need to know?
2. What do I already know that's relevant?
3. What constraints limit the solution space?
4. What does "good enough" look like for this context?
5. How will I know when I've found the right answer?

### Question Quality Check
- Bad: "How do I handle errors in Spring Boot?"
- Good: "How do I handle Kafka consumer errors in Spring Boot 3.x to avoid blocking the partition, given we're using a DLQ pattern and need idempotent processing?"

The more specific the question, the better the answer. Always add:
- Tech stack and version
- What already exists in the codebase
- What constraint is driving the question
- What "done" looks like

---

## Synthesis Protocol — After Research

### When Multiple Sources Conflict
1. State the conflict explicitly: "Source A says X, Source B says Y"
2. Identify which is more authoritative (official docs > blog posts > Stack Overflow)
3. Identify which is more recent (newer usually wins for fast-moving tech)
4. Identify which fits the constraints better
5. Recommend based on the above — state your reasoning
6. Flag if this is uncertain: "I'm recommending X but this is worth verifying in your specific environment"

### When Research Contradicts Past Decisions
1. Stop
2. State the contradiction clearly
3. Ask user to decide: keep old decision or update based on new information
4. Log the outcome either way

### Confidence Levels — Always Be Explicit
- **High confidence**: official documentation, well-established pattern, personal experience in codebase
- **Medium confidence**: generally accepted practice, multiple reliable sources agree
- **Low confidence**: single source, area of active debate, training data may be outdated
- Always state confidence level for important recommendations

---

## CareervyAI Research Context
When researching for CareervyAI specifically, always consider:
- Anthropic API rate limits and pricing (affects feature design)
- Desktop app constraints (not a web app — file system access, local storage OK)
- Private beta stage (30 users — can accept some rough edges)
- Security score 7.5/10 must be maintained — no research recommendation should regress this
- Stripe integration is live — payment-related changes need extra care
- Three envs — test in DEV before recommending PROD changes
