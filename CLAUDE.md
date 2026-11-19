# PawTrip — instructions for every agent

**Before doing anything, read `docs/AGENT_HANDOFF.md`** (decisions, current state, how to run/deploy, rules for working with other agents).
Before you stop, **update it** (section 6 state, section 5 decisions if any, section 9 session log, release your claim in 8.2).

- Talk to the user in Simplified Chinese; short and concrete.
- Backend (Supabase migrations and tests) lives in `/Users/ivan/workplace/pawtrip-backend`; app in `pawtrip/`.
- Check `npx tsc --noEmit` and `npx eslint src` (both silent) and look at the change in the browser before committing.
- No secrets in the repo.
- **UI principle (user rule, firm): the interface speaks through layout, not words** — read the section below before touching any screen.

## UI principle: layout speaks, words do not (界面只靠布局说话)

Every agent must follow this when building or rewriting any screen:

1. **Strong visual hierarchy and self-explaining structure instead of text.** Do not explain with copy.
2. **By default add no slogan-style text, teaching paragraphs, or per-section help/secondary captions.** No always-visible secondary text under titles, fields, buttons or cards.
3. **If extra information is truly needed, use an info icon with a tooltip**, not permanent secondary text.
4. **Keep what is necessary:** form labels and accessible names (aria/accessibility labels) for screen readers. The UI must be clean *without* sacrificing accessibility.
5. **Dangerous or irreversible actions keep a clear consequence statement** (confirmation popups, destructive buttons). Never strip these.
6. **After removing explanatory text, a first-time user must still see what to tap next and what a tap will do.** Test this against the screen before shipping.
7. **When rewriting an existing screen: first remove redundant labels and captions. Only if clarity drops, improve the layout and the button design** (size, position, icon, grouping, visual weight) — do not bring text back as the fix.
8. Always allowed (they carry state, not explanation): validation errors, confirmations, counts, empty states, toasts.

Related rules already in force: no cancel button in popups (tap outside closes), confirm-popup titles have no question mark, one plus button per card in bento layouts.

## Icons

Icons are being redesigned ("premium, but still cute"). Before creating or changing any icon, read `docs/icon-redesign-v2.md`. Do not use the old sticker style for anything new.
