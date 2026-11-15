# PawTrip — instructions for every agent

**Before doing anything, read `docs/AGENT_HANDOFF.md`** (decisions, current state, how to run/deploy, rules for working with other agents).
Before you stop, **update it** (section 6 state, section 5 decisions if any, section 9 session log, release your claim in 8.2).

- Talk to the user in Simplified Chinese; short and concrete.
- Backend (Supabase migrations and tests) lives in `/Users/ivan/workplace/pawtrip-backend`; app in `pawtrip/`.
- Check `npx tsc --noEmit` and `npx eslint src` (both silent) and look at the change in the browser before committing.
- No secrets in the repo. No helper/explanatory text in the UI unless the user asks.
