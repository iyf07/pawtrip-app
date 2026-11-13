# PawTrip TODO

## Design

- [ ] **Icon set (designed with ChatGPT)** — replace the emoji used as icons (rail, sections, categories, weather, status)
      with one consistent custom illustration set.
  - [x] Decide the visual style: sticker · warm & cute · existing palette · simplified bold outline.
  - [x] Write the master style prompt + per-icon prompts → `docs/icon-style-brief.md`.
  - [ ] Generate, pick, and clean up (transparent PNG/SVG, 1:1, one icon per image).
  - [ ] Add to `pawtrip/assets/icons/` and swap them in (rail: trips, dogs, settings, profile; sections: plan, ideas,
        members; categories: outdoors, food, coffee, sights, shopping, drinks, fun, stay, transit; weather; map pins).
  - Icons needed so far: logo/paw, trips (suitcase), dogs, settings, plan (calendar), ideas (bulb), members (people),
    9 categories, 7 weather types, empty-state dog.

## Product

- [ ] Email sign-in for friends: custom SMTP (Resend + a domain) so codes reach anyone, then push the 6-digit-code template.
- [ ] Sign in with the unique ID (needs a backend function, depends on SMTP).
- [ ] Delete the temporary "leader votes for any member" policy (`20261112001000_leader_test_vote.sql`) after testing.
- [ ] Settings: distance unit (mi/km), week start day, privacy / delete account.
- [ ] Conflict "fix" suggestions on the timeline.
- [ ] Invite link that joins automatically.
- [ ] Paid tier (RevenueCat / Stripe) — decide what to gate first.
- [ ] LLM features (via backend functions), currently switched off.

## Platforms / engineering

- [ ] iOS / Android: native map (`TripMap`), native photo cropper (`PhotoCropper`), `app.json` bundle ids, `eas.json`, TestFlight.
- [ ] GitHub CI: typecheck, lint, DB tests on every push.
