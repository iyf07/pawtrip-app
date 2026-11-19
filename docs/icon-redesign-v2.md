# Icon redesign v2 — "premium, still cute" (decided 2026-11-18)

**Status: TODO. The user will regenerate icons with ChatGPT. Until they are delivered the app keeps the old sticker icons. Which icons get which treatment is in "Triage" below (decided with the user's input 2026-11-18).**
Supersedes the look in `docs/icon-style-brief.md` (white die-cut sticker border, thick outline). The delivery pipeline described there
(flat white background → `scripts/clean-icons-white.py` → 1024 master + 512 UI file in `assets/icons`, then register in
`src/components/ui/Icon.tsx`) stays. **Keep every file name exactly as it is today**, so the swap needs no code change.

## Why

The app moved to a calmer, premium look (serif titles, soft tinted cards, no outlines, soft shadows). The old icons are glossy
stickers with thick brown outlines and a white border; next to the new pages they look like cartoon stickers on a magazine page.
The user's direction: **premium, but cute is not lost**. Think: a refined children's-book illustration, not a sticker sheet.

## The look (every icon obeys this)

- **Premium comes from restraint**: ≤ 2 fill tones + 1 small accent colour per icon, flat colour, generous empty space inside the
  silhouette, one simple idea per icon, nothing busy. No gradients, no gloss, no 3D bevel, no glitter/sparkles, no drop shadow, no glow.
- **Cute comes from proportion**: chubby, rounded forms; soft corner radii; tiny friendly details only (a blush dot, a dot-eye, a
  little curl of the tail). Faces only on dogs and the mascot, never on objects.
- **No white sticker border.** The cards around the icons are already white/tinted; the silhouette sits directly on the page.
- **Outline**: thin, even, soft — dark warm brown `#6B4F3A` at about 2.5 % of the icon width (never thinner than 1.5 %), rounded
  caps and joins. Same weight on every icon. (Old icons used a thick `#4A3628` outline; v2 is lighter and finer.)
- **Light**: one tiny white highlight arc at the top-left, at most.
- **Canvas**: square 1:1, object fills ~78 % of the canvas, centred, equal margin; same optical size across icons.
- **Background**: one flat pure white `#FFFFFF`, perfectly uniform (our script cuts the icon out). No checkerboard, no fake
  transparency, no noise, no stray specks, no grid lines, no labels. 15 % empty margin per cell when several icons share a sheet.
- **Readable at 24–56 px**: no hairlines, no tiny parts. Chunkier is better than detailed.
- **People are neutral** (simple round head, no gendered hair); no named characters.
- **Actions (`ui-*`) are the same family but simpler**: single object, no faces, slightly lighter detail than content icons.

## Palette

Ink / outline `#6B4F3A` (dark details `#4A3628`). Accent gold `#FFC72C`.
Soft fills (the same family the pages use):

| Name | Fill | Deeper tone (for shading) | Used for |
|---|---|---|---|
| Cream | `#FFF0C4` | `#F5D98A` | dogs, general / default objects |
| Soft blue | `#E8F3F7` / `#CDE7F0` | `#3D7590` | friends, water, weather-cold, dog accents |
| Soft mint | `#E2F3E9` | `#3E8E57` | family, outdoors, nature |
| Peach | `#FDE5D8` | `#D9702E` | me / profile, food |
| Lavender | `#EDE6F8` | `#7B5EA7` | trips, sights |
| Butter | `#FFF3B8` | `#B8860B` | notifications, fun |
| Rose | `#F7DCE8` | `#C2477F` | shopping, drinks |
| Sand | `#ECE3D6` | `#8F806F` | transit, neutral |

Category colours of the plan (outdoors, food, coffee, sights, shopping, fun, drinks, stay, transit) keep their hue: main fill = its
soft tint, shading/outline accent = its deeper tone (see the table in `icon-style-brief.md`).

## Shapes in the app (so icons match the UI)

People = circle avatars with a gold border; **dogs = rounded squares with a blue border**. Dog icons should look good inside a
rounded square; person icons inside a circle.

## The list (161 files, grouped; names unchanged)

| Group | Files | Notes for the prompt |
|---|---|---|
| `nav-*` (7) | nav-trips, nav-dogs, nav-family, nav-profile, nav-settings, nav-notifications, nav-admin | Main navigation. Briefly: a suitcase, a dog, two people under a roof/heart, a single person, a cog with a paw, a bell, a shield-badge (admin, clearly not a crown). |
| `tab-*` (3) | tab-plan, tab-ideas, tab-members | calendar, lightbulb/bookmark, two people |
| `ui-*` (17) | archive, camera, chat, clock, copy, crown, discard (✗), dog-warning, invite, key, note, pencil, save (✓), share, trash, warning, zoom | Actions: simplest family. save = ✓ in a soft green accent, discard = ✗ in a soft red accent (they are drawn inside a 40 px ring button). |
| `empty-*` (5) | empty-day, empty-discover, empty-map, empty-offline, empty-trips | The most illustrative: small scene with a dog, still two-tone and calm. These are where "cute" can speak loudest. |
| `logo-paw` | 1 | The brand paw; keep recognisable, refine. |
| `cat-*` (9) | outdoors, food, coffee, sights, shopping, fun, drinks, stay, transit | Plan categories; each in its own hue. |
| `int-*` (24) | beaches, hiking, lakes, camping, viewpoints, wildlife, museums, markets, workshops, amusement, breweries, spa, pizza, dessert, american, chinese, indian, italian, japanese, korean, mediterranean, mexican, thai, vietnamese | Interests: one simple object each; cuisines by an iconic dish. Distinct silhouettes, no flags. |
| `diet-*` (7) | vegetarian, vegan, glutenfree, dairyfree, halal, kosher, nutallergy | Symbolic, calm; no religious text/lettering. |
| `dog-*` (6) | alone, sitter, with, tbd, int-fetch, int-swimming | Dog-flavoured, rounded-square friendly. |
| `trait-*` (2) | trait-recall, trait-runner | small dog trait badges |
| `mood-*` (3) | yay, ok, meh | three clearly different moods, simplest faces |
| `pin-*` (3) | stop, stay, idea | map pins; must read at 38×46 px |
| `wx-*` (9) | sun, partly, cloud, fog, rain, snow, storm, sunrise, sunset | Weather; soft blue/butter, calm |
| `scale-*` (65) | 13 scales × 5 levels: alone, car, energy, morning, noise, pace, recall, spending, temp, temperature, walk, withdogs, withpeople | **Each scale is a progression 1→5**: same object, clear step from low to high; generate all 5 levels of one scale in ONE sheet so they stay consistent. `temp-*` and `temperature-*` are two names for the same scale: draw once, save under both names. |

## How to ask ChatGPT (working method)

1. New chat. Paste the **master prompt** below plus 2–3 approved examples as image attachments (after the first approved batch,
   always attach the best approved icons so every later batch matches).
2. One batch = one group (or one scale = 5 levels). Ask for a single sheet or one file per icon; file name = target name.
3. Review at 32 px and 56 px next to the page colours (`#FCF8F0`, white, cream, mint, blue) before accepting.
4. Deliver to `assets/icons/` (1024 px master in `assets/icons/masters/`, 512 px UI file), run the clean script, check in the browser.
5. Record each finished batch in `docs/icon-batches.md` (prompt used, files, date) like the earlier batches.

### Master prompt (paste first)

```
You are designing icons for PawTrip, a dog-friendly group trip planner. The look is "premium but still cute": a refined
children's-book illustration, calm and modern, never a glossy cartoon sticker.

Rules for every icon:
- One centred object, simple chubby rounded forms, one idea, readable at 28 px.
- Flat colour only: at most two soft fill tones plus one small accent colour. No gradients, no gloss, no 3D bevel, no glitter,
  no drop shadow, no glow, no white sticker border.
- A thin, even, soft outline in warm brown #6B4F3A, about 2.5% of the icon width, rounded caps and joins. Same weight on every icon.
- At most one tiny white highlight arc at the top-left.
- Cute only through proportion and tiny friendly details (a blush dot, a dot-eye, a curl). Faces only on dogs and the mascot.
- People are gender-neutral: simple round head, no hair style.
- Palette: cream #FFF0C4, soft blue #CDE7F0 (deep #3D7590), soft mint #E2F3E9 (deep #3E8E57), peach #FDE5D8 (deep #D9702E),
  lavender #EDE6F8 (deep #7B5EA7), butter #FFF3B8 (deep #B8860B), rose #F7DCE8 (deep #C2477F), sand #ECE3D6 (deep #8F806F),
  gold accent #FFC72C, ink #6B4F3A.
- Background: ONE flat uniform pure white #FFFFFF, edge to edge. No checkerboard, no transparency, no noise, no specks.
- Square 1:1 canvas, the icon fills about 78% of it, centred with equal margin. If a sheet holds several icons, each sits in its own
  cell with 15% empty margin on all sides; nothing touches or crosses a neighbouring cell; no grid lines, labels or numbers.
- Same optical size, same line weight, same corner roundness and same top-left light on every icon.
Reply only with the images. I will name the batch and list the icons next.
```

## Rules for future icon work

- New icons always follow this brief, not the old sticker brief.
- Never put a white sticker border or a heavy outline on a new icon.
- Colour = meaning: a category keeps its colour everywhere (see the Palette table and the page colour mapping in the handoff).

## Triage: which icons change, how, and in what order

Two looks live side by side, chosen by what the icon *is*:

| Tier | Look | Which icons | Why |
|---|---|---|---|
| **A. Minimal mono-line** (premium, quiet) | One colour (the page's ink `#5B4636`), uniform 1.75–2 px rounded line, no fill, no face, no outline-plus-fill. Optionally ONE soft accent (gold dot) on the active state. 24–28 px on a 40 px soft round plate. Draw as SVG/line, or ask ChatGPT for single-colour line art on white. | **`ui-*` (17)**: copy, share, pencil, save (✓), discard (✗), trash, archive, camera, chat, clock, key, note, warning, zoom, invite, crown, dog-warning. **`tab-*` (3)**: plan (calendar), ideas (bulb), members. **`nav-settings`, `nav-notifications`**. | These are *actions and controls*. They must be calm, tiny and identical in weight; stickers make them heavy (the family page action cards were the example). |
| **B. Duotone cute** (v2 "premium but cute") | Flat 2 tones + 1 accent, thin soft outline `#6B4F3A`, chubby forms, tiny details, no white sticker border (see "The look" above). | **`nav-trips`, `nav-dogs`, `nav-family`, `nav-profile`, `nav-admin`** (identity of the sections); **`empty-*` (5)** (the most illustrative, with the mascot); **`logo-paw`**; **`dog-*` (6)**; **`mood-*` (3)**; **`pin-*` (3)**; **`trait-*` (2)**; **`cat-*` (9)** (category hues); **`int-*` (24)** (interests); **`diet-*` (7)**; **`wx-*` (9)**. | Content and identity: this is where PawTrip's personality lives, so they stay colourful and cute, just calmer and consistent. |
| **C. Keep as they are for now** | Current sticker look. | **`scale-*` (65)**: 13 scales × 5 levels. | Highest cost, small on screen (28 px inside cards), a progression that must stay consistent as a set. Regenerate LAST, in v2 style, after the mascot and tier A/B are done; until then they sit acceptably inside the tonal cards. |

**Order of work**: (1) mascot + character sheet (`docs/mascot-brief.md`) → (2) tier A (`ui-*`, `tab-*`, two nav icons) — quickest visible win → (3) tier B nav + empty states + `logo-paw` + `dog-*` + `mood-*` + `pin-*` → (4) `cat-*`, `int-*`, `diet-*`, `wx-*`, `trait-*` → (5) `scale-*`.

**Rule of thumb**: an icon that *does* something (button, control, tab) = tier A. An icon that *means* something (a thing, a place, a food, a dog) = tier B. Anything with a person/dog character uses the mascot's face and proportions.

**Where the code sits** (for the swap): all icons are registered in `src/components/ui/Icon.tsx` (`SOURCES`). Tier A icons are used at 24–28 px in buttons, cards' action tiles (`BentoAction`, 56 px today → should become ~28 px on a soft plate), `Tile`/`BentoCard` headers; keep file names so no code changes are needed, but when tier A arrives also shrink the 56 px action-card icons in `features/circle/Bento.tsx` (`BentoAction`) and in `FamilyPanel.tsx` / `profile.tsx` / `DogForm.tsx`.
