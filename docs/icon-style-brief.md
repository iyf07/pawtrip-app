# PawTrip icon style brief (for ChatGPT image generation)

Decided style: **sticker look · warm & cute · existing palette · simplified, bold outlines**.

## What it should feel like

A friendly sticker you would stick on a travel journal: round, chunky, a little dog-flavoured. It must read at
26–44 px in the navigation rail, so every icon is one simple silhouette with one idea, thick outline, flat color.

## Fixed rules (every icon obeys these)

- **Shape**: one centered object, simple rounded forms, no tiny details, no text, no letters.
- **Outline**: a thick, even, dark-brown line (`#4A3628`), rounded corners and caps. Same thickness on every icon.
- **Sticker border**: a thick, clean white outline (`#FFFFFF`) around the whole silhouette, like a die-cut sticker.
  **No drop shadow and no glow** (the app adds its own shadow); the white border edge must be crisp and smooth.
- **Fill**: flat color, at most 2 tones + one small highlight. No gradients, no textures, no realistic shading.
- **Face / dog flavour**: only where it fits (logo, dogs, empty states). Simple dot eyes + tiny nose, never on objects like a calendar.
- **Background**: ONE flat solid **pure white** `#FFFFFF`, perfectly uniform, edge to edge. No checkerboard pattern, no
  fake transparency, no gradient, no noise, no glow, no speckles, no shadow on it. (Real transparency from ChatGPT leaves
  noisy specks around the sticker; we cut the icon out ourselves and rebuild the white sticker border and a soft shadow in
  code, so every icon gets exactly the same border.)
- **Canvas**: square 1:1, object fills ~80% of the canvas, centered, equal padding.
- **Clean cells (very important):** every icon sits fully inside its own cell with at least 15% empty white margin on all
  four sides. Nothing from one icon may touch, cross, or leak into a neighbouring cell. No stray fragments, slivers, dots,
  specks or partial shapes anywhere, especially at cell edges. No grid lines, no labels, no numbers, no frames.
- **Clean edges:** the outer edge of the white sticker border is crisp and smooth, with NO colored fringe, halo, outline
  or glow around it (no pink/purple/gray rim). The white border has the same thickness on every icon (about 4% of the icon width).
- **Same visual size:** every icon's largest dimension fills the same share of its cell (80%), so a wide icon and a
  tall icon look equally big. Same optical weight: same outline thickness (never thinner than 1.5% of the icon width).
- **No hairlines:** no thin rays, sparkles or details thinner than the outline; they disappear at 32 px. Use fewer, chunkier parts.
- **Neutral people:** any person/avatar icon is gender-neutral and not a specific character (simple round head, no
  hairstyle that reads as one gender, no named character), because it stands for any user.
- **Consistency**: same line weight, same corner roundness, same light direction (top-left), same shadow on every icon.

## Palette (from the app)

| Use | Color |
|---|---|
| Main / highlight (gold) | `#FFC72C` |
| Outline & dark details | `#4A3628` |
| Sticker border | `#FFFFFF` |
| Page background (for previews) | `#FCF8F0` |
| Outdoors | `#3E8E57` (tint `#DCEEDF`) |
| Food | `#D9702E` (tint `#FBE5D3`) |
| Coffee | `#8B5A3C` (tint `#EFDFD2`) |
| Sights | `#7B5EA7` (tint `#E9E1F4`) |
| Shopping | `#C2477F` (tint `#F7DCE8`) |
| Fun | `#B8860B` (tint `#FBF0CF`) |
| Drinks | `#9B2C4A` (tint `#F5DCE3`) |
| Stay | `#3D7590` (tint `#CDE7F0`) |
| Transit | `#8F806F` (tint `#ECE3D6`) |

Navigation / UI icons use gold + dark brown + white. Category icons use their category color as the main fill and
the tint as the secondary fill.

## Master prompt (paste first, in a new ChatGPT chat)

```
You are designing one consistent icon set for a dog-friendly group trip planner app called PawTrip.
Style: cute die-cut sticker icons. Simple rounded silhouette, ONE centered object per cell, thick even dark-brown
outline (#4A3628) with rounded corners, flat color fills (max 2 tones plus one small white highlight), and a thick,
crisp white sticker border around the whole shape. Warm, friendly, slightly chubby proportions. No gradients, no
textures, no realistic shading, no drop shadow, no glow, no text or letters. Light comes from the top-left.
Palette: gold #FFC72C, dark brown #4A3628, white #FFFFFF, plus the accent color I give you per icon.
Icons must stay recognizable at 32 px.
Background: one perfectly flat solid pure white (#FFFFFF) filling the whole image edge to edge, with NO checkerboard,
NO fake transparency, NO noise, NO gradient and NO shadows on it.
Square 1:1 images. Each icon fills about 80% of its cell with equal padding, and cells in a grid are clearly
separated by wide white gaps so they can be cut apart.
Cleanliness rules: every icon sits fully inside its own cell with at least 15% empty white margin on all sides;
nothing from one icon may touch or leak into a neighbouring cell; no stray fragments, slivers, dots or specks anywhere;
no grid lines, labels or numbers. The outer edge of the white sticker border is crisp and smooth with no colored
fringe, halo or glow, and the border has the same thickness on every icon. Same visual size for every icon.
No thin rays, sparkles or hairline details (chunkier parts only). People/avatars are gender-neutral.

I am attaching 8 icons that are already approved (logo, trips, dogs, settings, profile, plan, ideas, members).
Match their line thickness, corner roundness, outline color, sticker border width and level of detail exactly.

Confirm you understand the style, then wait for my list of icons. Make them in batches of 9 as a 3x3 grid.
```

## Then, per batch

Send the template below with the next 9 icons from the checklist. Always keep the 8 approved icons attached.

## Full icon checklist (each one becomes one file in `pawtrip/assets/icons/`)

**Batch 1 — Navigation & sections (8)**

| App label | Icon | Accent | File |
|---|---|---|---|
| Logo | paw print | gold | `logo-paw.png` |
| 行程 Trips | suitcase | gold + brown | `nav-trips.png` |
| 狗狗 Dogs | dog face | gold + brown | `nav-dogs.png` |
| 设置 Settings | gear | gold + brown | `nav-settings.png` |
| 个人主页 Profile | round smiley avatar | gold | `nav-profile.png` |
| 计划 Plan | calendar page | gold + brown | `tab-plan.png` |
| 想法 Ideas | light bulb | gold + brown | `tab-ideas.png` |
| 成员 Members | two people | gold + brown | `tab-members.png` |

**Batch 2 — All activity types (9)** (accent color from the palette above)

| App label | Icon | Accent | File |
|---|---|---|---|
| 户外 Outdoors | pine tree (or hiking boot) | green | `cat-outdoors.png` |
| 餐厅 Food | fork, knife and plate | orange | `cat-food.png` |
| 咖啡 Coffee | coffee cup | brown | `cat-coffee.png` |
| 景点 Sights | camera | purple | `cat-sights.png` |
| 购物 Shopping | shopping bag | pink | `cat-shopping.png` |
| 品酒 Drinks | wine glass | wine red | `cat-drinks.png` |
| 活动 Fun | party popper | mustard | `cat-fun.png` |
| 住宿 Stay | small house / bed | blue | `cat-stay.png` |
| 交通 Transit | car | gray | `cat-transit.png` |

**Batch 3 — Weather (7):** sun, partly cloudy, cloud, rain, thunderstorm, snow, fog — `wx-sun.png` … `wx-fog.png`.

**Batch 4 — Map & small marks (7):** numbered stop pin, hotel pin, idea pin, paw bullet, leash, dog bowl, tent.

**Batch 5 — Empty-state illustrations (3, larger, more detail allowed):** happy dog with a suitcase, dog looking at a map, dog with a calendar.

Status icons (planned / idea / done) can reuse the bulb, a check mark badge and the calendar; add them later if needed.

## How to prompt each batch (template)

```
Same style as the attached approved icons (cute die-cut sticker, thick dark-brown #4A3628 outline, crisp white
sticker border, flat fills, no shadow, light from top-left, no text, 1:1).
Background: perfectly flat solid pure white #FFFFFF, no checkerboard, no noise, no shadows; wide white gaps between cells.
One single image, square, 3x3 equal cells, no grid lines, no labels. Each icon fully inside its own cell with at
least 15% white margin on all sides, nothing crossing into neighbouring cells, no stray specks or slivers, crisp edges
with no colored fringe, same white border thickness and same visual size on every icon. Chunky shapes only.
Make 9 separate icons, each centered:
1) <icon> — accent <color>
2) ...
```

## Tips to keep the set consistent

- Do everything in **one chat** so ChatGPT can see the approved sheet; don't start new chats for new batches.
- If an icon drifts, reply "Redo #4 only, match the line thickness and corner roundness of the reference sheet".
- Ask for a **grid** (many icons per image) instead of separate images: it is much more consistent.
- Check at small size: shrink the result to 32 px and see if each icon is still readable. Simplify if not.
- Export: ask for the grid as one PNG on flat pure white. Send me the images; I cut the grid into single files and
  remove the white background precisely (no background-remove tool needed).
- Attach the 8 approved icons (`pawtrip/assets/icons/`) at the start of every new chat so the style stays identical.
- Keep file names like `nav-trips.png`, `cat-food.png`, `wx-rain.png`, `map-pin-stop.png` in `pawtrip/assets/icons/`.

## What I (Claude) do after you have the images

1. Crop the sheets into single files, trim padding, make 1x/2x/3x sizes.
2. Put them in `pawtrip/assets/icons/` and replace the emoji in the rail, sections, categories, weather and map pins.
3. Check light and dark mode (the white sticker border keeps them readable on dark).

## Quality checklist (what I check on every batch — send me the image and I tell you what to fix)

1. **Stray fragments** at the edges of a cell (leftovers of the neighbour) → I remove them in code, but tell ChatGPT "more margin".
2. **Colored fringe / halo** on the border edge → I remove it in code (the border is white).
3. **Same size / weight / border thickness** across the batch → I normalize the size; thickness differences need a redo.
4. **Readable at 32–44 px** (I render a small row) → thin details get redone chunkier.
5. **Readable on dark** (white border on `#231B15`) → check the outline contrast.
6. **Meaning** — does each icon say what the label says, and is it neutral where it should be (avatar)?

### Notes from batch 1 (v2)

- Cleaned by code: white slivers from neighbouring cells (suitcase, calendar, bulb, members), faint pink dots on the border edge.
- Redo candidates: `nav-profile` is a specific woman — make it a gender-neutral avatar; `tab-ideas` rays are thin
  (still fine at 44 px, but chunkier is safer); gear hole is pure white (fine).

## Pipeline for every batch (always from the original files, latest file by timestamp)

1. Take the **newest** zip/files in `/Users/ivan/workplace/icons/` (by timestamp) and unzip the original 1024px images
   into a fresh folder — never resized copies.
2. White-background images (the current prompts): `pawtrip/scripts/clean-icons-white.py <dir> <out> <px>` finds the
   silhouette from the artwork (dark outline + warm fills), drops everything outside it (grey shadow, colored fringe,
   slivers from neighbouring cells), and rebuilds one uniform white sticker border. (Old transparent-background
   images: `pawtrip/scripts/clean-icons.py`.)
3. Keep the **1024px clean masters** in `pawtrip/assets/icons/masters/` and ship **512px** files in `pawtrip/assets/icons/`
   (UI shows icons at 26–128 px, so 512 is sharp even on 3x screens; masters are for app icons / splash / print).

### Notes from batch 2 (activity types)

- 7 of 9 are great and shipped: outdoors (pine tree), coffee (cup with a paw), shopping (bag with a paw), drinks (wine glass),
  fun (ticket with a star), stay (bed), transit (bus).
- **Redo `cat-food` and `cat-sights`**: both came out as another coffee/tea cup instead of **fork + knife + plate** (food) and a
  **camera** (sights). Their masters are kept in `assets/icons/masters/` but not used; the app shows emoji for these two for now.
- Prompt lesson: ChatGPT sometimes repeats a subject. For every icon, name the **exact object and say what it must NOT be**, e.g.
  "food: a plate with a fork and a knife on each side (NOT a cup or bowl)"; "sights: a camera with a lens and a flash (NOT a cup)".
  Always give a distinct silhouette per icon (no two icons with the same outline).
- Redo prompt (attach the approved icons, same template as above):
  `1) food — a round plate seen from above with a fork on the left and a knife on the right, accent orange #D9702E (NOT a cup, NOT a bowl)`
  `2) sights — a compact camera with a round lens, a small flash and a viewfinder bump, accent purple #7B5EA7 (NOT a cup)`
