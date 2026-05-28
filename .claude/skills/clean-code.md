# Clean Code — Zero Dead Code Policy

## The Rule
- Zero tolerance for dead code
- Every line in the codebase must be actively used
- When in doubt — delete it

## Before Adding Any New Code
- Check if similar functionality already exists in the codebase
- Check if you are duplicating logic from another file
- Reuse before creating
- If replacing old code — delete the old version immediately

## Dead Code to Remove Always
- Commented-out code blocks — delete immediately
- Unused imports — remove on every file touch
- Unused variables — remove immediately
- Unused functions — remove immediately
- Unused components — remove immediately
- Unused CSS classes — remove immediately
- TODO comments older than the current task — flag for deletion
- console.log statements — remove before any commit
- Hardcoded test data — remove before commit

## Refactoring Triggers
- Duplicate logic found anywhere → extract to shared utility immediately
- Function doing 2+ unrelated things → split it
- Component rendering 2+ unrelated UI sections → split it
- File over 200 lines → suggest splitting by responsibility
- Same code copied in 3+ places → extract immediately (DRY principle)

## After Completing Any Task — Mandatory Audit
- What imports did I add that are now unused?
- What variables did I declare but not use?
- What functions did I create but not call?
- Did I leave any console.log statements?
- Did I leave any TODO comments?
- Did I leave commented-out old code?

## Code Review Checklist — Before Finishing
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] No unused imports
- [ ] No unused variables or functions
- [ ] No hardcoded values (use constants or .env)
- [ ] No magic numbers (give them names)
- [ ] No any types in TypeScript
- [ ] No TODO comments left unresolved
- [ ] No duplicate logic
- [ ] All added code is actually called/used

## Naming Rules — Prevent Future Dead Code
- Names must be so clear the code is self-documenting
- No abbreviations (usr → user, btn → button, cfg → config)
- Boolean names start with is/has/can/should (isLoading, hasError)
- Function names are verbs (getUserById, sendEmail, validateInput)
- Constants are SCREAMING_SNAKE_CASE (MAX_RETRY_COUNT)
