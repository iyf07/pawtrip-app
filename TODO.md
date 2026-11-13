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

- [ ] **Paw product logo system** (each product logo writes its full product word — Trip / Feel / Bowl — and ONE letter of the word is a
  paw print: the roundest letter, or the dot of the i; same type, one color per product) — brief and prompts in `docs/logo-brief.md`.
  - [x] Direction: minimal flat wordmark (two colors, no gloss/outline/sticker edge) · full word · the cute paw lives INSIDE one letter (no separate paw) · cream/cocoa/soft pastel backgrounds.
  - [ ] Confirm product names (Trip / Travel? Feel, Bowl, Walk ...) and which letter becomes the paw.
  - [ ] Explore 4 layouts × 3 products with ChatGPT (Prompt 1), pick one.
  - [ ] Refine (Prompt 2), test that it scales to Walk / Play (Prompt 3).
  - [ ] Claude redraws it as exact SVG with real Nunito letters and exports all sizes (app icons, favicon, store assets, horizontal wordmark).
  - [ ] Build a `Logo` component (`<Logo product="trip" />`), swap in the rail, mobile navbar, sign-in, splash, app icon.

  - [ ] Redo the two wrong activity icons: **food** (plate + fork + knife) and **sights** (camera) — both came out as cups (see `docs/icon-style-brief.md`).
  - [ ] Next batches: weather (7), map pins, empty-state dog illustrations; redo a gender-neutral profile avatar.

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
