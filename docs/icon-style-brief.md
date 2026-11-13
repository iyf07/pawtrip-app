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
You are designing icons for a dog-friendly group trip planner app called PawTrip. Every icon must match the app's EXISTING icon
style exactly (I attach the approved icons if I can; here is the style in words too):

STYLE (identical for every icon): cute die-cut sticker icon. One chubby, rounded, friendly object, centered. A thick, even,
dark-brown (#4A3628) outline with rounded corners and rounded line caps (the same line thickness on every icon). Flat color fills
with at most 2 tones plus a small glossy white highlight (a short curved stripe and a tiny dot) on the upper-left of the main
shape. A thick, clean, crisp white sticker border around the whole silhouette (the same thickness on every icon). Warm palette:
gold #FFC72C and amber, dark brown #4A3628, cream #FFF4D6, white; plus the accent color I give you per icon. Warm, soft, slightly
chubby proportions, light from the top-left. NO drop shadow, NO glow, NO gradients other than the subtle tone shift, NO textures,
NO realistic shading, NO text or letters, NO thin hairline details (chunky shapes only, readable at 24 px).

FILES (very important): create EACH icon as its OWN SEPARATE image file, not a sheet or a grid. One icon per image. Each image is
square 1024x1024 with a perfectly flat pure white (#FFFFFF) background (no checkerboard, no noise, no shadow, no gradient on the
background), the icon centered and filling about 80% of the image with equal empty margin on every side, nothing cut off, no
stray specks. Name each file exactly as I specify (for example "ui-camera.png"). Deliver all files together as ONE downloadable ZIP
containing only those PNG files. Do not combine icons into one picture.

CONSISTENCY: all icons in this chat must look like one family: same outline thickness, same white border thickness, same highlight
style, same level of detail, same visual size. People/avatars are gender-neutral.

Confirm you understand, then wait for my list of icons.
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
Same style as the approved icons in this chat (cute die-cut sticker, thick even dark-brown #4A3628 outline, crisp white sticker
border, flat fills with a glossy white highlight on the upper-left, no shadow, chubby and friendly, chunky shapes only).
Create each icon below as its own SEPARATE 1024x1024 PNG file (one icon per image, never a sheet or grid), perfectly flat pure
white #FFFFFF background, icon centered at about 80% of the image, equal margin on all sides, no stray specks, with exactly the
file name given. Deliver all files in ONE ZIP.
Match the existing icons' outline thickness, white border thickness, highlight and level of detail exactly.
Icons:
1) file "<name>.png" — <exact object> — accent <color> (must NOT be <what to avoid>)
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

## Audit: everything that is still an emoji in the app (batches 3–9, in priority order)

**Ready-to-send versions of every batch (copy a whole block, nothing else to add): `docs/icon-batches.md`.**

Use the master prompt, then for each batch the batch template: **one separate PNG file per icon**, all delivered in one ZIP, with
the file names below. Write the exact object and what it must NOT be. Keep sticker style, gold/accent colors as noted.

**Batch 3 — controls (you asked for the first two; cute and friendly):**
1) file "ui-camera.png" — camera badge — a cute chubby camera with a big round lens, small flash, tiny paw print on the front, accent gold (for the photo
   button on avatars and dog photos; must read at 24 px)
2) file "ui-pencil.png" — pencil — a cute chubby pencil, slightly tilted, yellow body with a pink eraser and a small brown tip, accent gold (the "edit" button
   next to the username)
3) file "ui-trash.png" — trash can — rounded bin with a lid, accent red `#B42318` (delete)
4) file "ui-archive.png" — archive box — a box with a lid and a downward arrow, accent gray-brown (archive trip)
5) file "ui-copy.png" — copy — two overlapping rounded squares (copy), accent gray-blue
6) file "ui-share.png" — share — a rounded arrow leaving a box (share), accent blue `#3D7590`
7) file "ui-invite.png" — invite — a person with a small plus, accent gold (invite friends)
8) file "ui-key.png" — key — a chubby key with a paw-shaped head, accent gold (join with a code)
9) file "ui-zoom.png" — magnifier — a chubby magnifying glass (zoom in the photo cropper), accent gray-blue

**Batch 4 — interests & the two redos** (files: `cat-food.png`, `cat-sights.png`, `int-beaches.png`, `int-camping.png`, `int-wildlife.png`, `int-museums.png`, `int-viewpoints.png`, `int-breweries.png`, `int-hiking.png`):
1) plate with fork and knife (food — REDO: NOT a cup), accent orange `#D9702E`
2) camera with a lens and a flash (sights — REDO: NOT a cup), accent purple `#7B5EA7`
3) beach — a palm tree and a wave, accent sky blue
4) tent — a camping tent with an open door, accent green
5) wildlife — a friendly deer head with antlers (NOT a dog), accent brown
6) museum — a building with columns and a triangular roof, accent beige
7) binoculars (viewpoints), accent purple
8) beer mug with foam (breweries — NOT a wine glass), accent amber
9) hiking boot (hiking), accent green

**Batch 5 — weather (7) + 2** (files: `wx-sun.png`, `wx-partly.png`, `wx-cloud.png`, `wx-rain.png`, `wx-storm.png`, `wx-snow.png`, `wx-fog.png`, `wx-sunrise.png`, `wx-sunset.png`):
sun; partly cloudy (sun behind a cloud); cloud; rain (cloud with drops); thunderstorm (cloud with a bolt); snow (cloud with
snowflakes); fog (cloud with horizontal lines); sunrise (sun on the horizon with an up arrow); sunset (sun on the horizon with a down arrow).
Sky blue + gold, soft and round.

**Batch 6 — map pins & dog arrangements (9)** (files: `pin-stop.png`, `pin-stay.png`, `pin-idea.png`, `dog-with.png`, `dog-sitter.png`, `dog-alone.png`, `dog-tbd.png`, `ui-warning.png`, `ui-dog-warning.png`):
1) numbered stop pin (an empty round pin, we draw the number ourselves), accent gold
2) stay pin (pin with a small house), accent blue
3) idea pin (pin with a small bulb), accent amber
4) dog goes along ("with") — a happy dog face with a small paw
5) dog with a sitter — a dog face next to a small hand/person
6) dog stays home ("alone") — a small house with a dog face in the window
7) dog undecided ("tbd") — a dog face with a question mark
8) warning — a rounded triangle with an exclamation mark, accent orange
9) dog-and-warning — a dog face with a small warning triangle

**Batch 7 — moods & dog traits & members (9)** (files: `mood-yay.png`, `mood-ok.png`, `mood-meh.png`, `trait-runner.png`, `trait-recall.png`, `ui-crown.png`, `ui-chat.png`, `ui-clock.png`, `ui-note.png`):
1) mood happy — a happy dog face, big smile; 2) mood ok — a calm dog face; 3) mood meh — a worried dog face
4) runner ("lets go and runs") — a dog running with motion lines; 5) comes back when called — a dog with a small heart/whistle
6) crown (trip leader), accent gold; 7) chat bubble (feedback and comments), accent gold; 8) clock (time), accent brown;
9) note / memo (notes), accent yellow

**Batch 8 — dietary needs (7)** (files: `diet-vegetarian.png`, `diet-vegan.png`, `diet-glutenfree.png`, `diet-dairyfree.png`, `diet-nutallergy.png`, `diet-halal.png`, `diet-kosher.png`):
vegetarian (a leaf), vegan (a sprout in a heart), gluten-free (a wheat ear with a slash), dairy-free (a milk bottle with a slash),
nut allergy (a peanut with a slash), halal (a crescent moon with a small star), kosher (a star of David outline). Accent green /
cream tones, calm and respectful.

**Batch 9 — empty-state illustrations (4, larger, more detail allowed; files: `empty-trips.png`, `empty-map.png`, `empty-day.png`, `empty-offline.png`):**
1) a happy dog with a suitcase (no trips yet); 2) a dog looking at a map (no places); 3) a dog sleeping next to a calendar (empty day,
replaces the bone emoji); plus 4) a dog with a "no signal" antenna (load failed).

Notes: use the camera and pencil from batch 3 at once (they are used on every profile and photo). Batch 4 replaces the interest emoji
and fixes the two wrong activity icons; batch 5 replaces the weather emoji used in the day boxes and the hourly weather.
