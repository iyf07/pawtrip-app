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

- [ ] **Paw wordmark logos** (Trip / Feel / Bowl: bold rounded soft-brown word on pure white; the one letter that holds a big paw is
  in the product color — Trip i gold `#FEC119`, Feel e pink `#EB86A6`, Bowl o orange `#F48D4B`) — brief and prompts in
  `docs/logo-brief.md` (reference image in `docs/logo-explore/wordmark-reference-v1.png`).
  - [x] Direction decided (from the liked wordmark): white background, paw letter in product color, bigger paw.
  - [ ] Generate with Request 1 (two paw sizes, each logo as a separate PNG in a ZIP), pick one.
  - [ ] Claude redraws as exact SVG with a real font; exports app icons / favicon / store assets / one-color / dark.
  - [ ] Build a `Logo` component (`<Logo product="trip" />`) and swap in the rail, navbar, sign-in, splash, app icon.

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
