# PawTrip TODO

## Design

- [ ] **Icon set (designed with ChatGPT)** — replace the emoji used as icons (rail, sections, categories, weather, status)
      with one consistent custom illustration set.
  - [x] Decide the visual style: sticker · warm & cute · existing palette · simplified bold outline.
  - [x] Write the master style prompt + per-icon prompts → `docs/icon-style-brief.md`.
  - [ ] Generate, pick, and clean up (transparent PNG/SVG, 1:1, one icon per image).
  - [ ] Add to `pawtrip/assets/icons/` and swap them in (rail: trips, dogs, settings, profile; sections: plan, ideas,
        members; categories: outdoors, food, coffee, sights, shopping, drinks, fun, stay, transit; weather; map pins).
  - Icons needed (full list with file names in `docs/icon-style-brief.md`): logo, 行程, 狗狗, 设置, 个人主页,
    计划, 想法, 成员; all 9 activity types (户外, 餐厅, 咖啡, 景点, 购物, 品酒, 活动, 住宿, 交通); 7 weather types;
    map pins; 3 empty-state illustrations.

- [ ] **Paw series logo** (Paw Travel now; Paw Feel / Paw Walk later) — brief and prompts in `docs/logo-brief.md`.
  - [x] Decide direction: same paw + a product emblem in the pad (Travel: pin, Feel: heart, Walk: leash) · stacked (mark on top, text below) · one main color per product · rounded bold type.
  - [ ] Generate the Paw Travel mark (paw + pin, 4 variations) with ChatGPT, pick one.
  - [ ] Generate the family (Feel: pink + heart, Walk: green + leash, Play: blue + ball) to check it works as a series.
  - [ ] App icon (1024) + stacked lockup reference.
  - [ ] Build a `Logo` component (`<Logo product="travel" />`), swap in the rail, mobile navbar, sign-in, favicon, splash, app icons.

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
