# PawTrip icon style brief (for ChatGPT image generation)

Decided style: **sticker look · warm & cute · existing palette · simplified, bold outlines**.

## What it should feel like

A friendly sticker you would stick on a travel journal: round, chunky, a little dog-flavoured. It must read at
26–44 px in the navigation rail, so every icon is one simple silhouette with one idea, thick outline, flat color.

## Fixed rules (every icon obeys these)

- **Shape**: one centered object, simple rounded forms, no tiny details, no text, no letters.
- **Outline**: a thick, even, dark-brown line (`#4A3628`), rounded corners and caps. Same thickness on every icon.
- **Sticker border**: a thick white outline (`#FFFFFF`) around the whole silhouette, like a die-cut sticker,
  with a very soft drop shadow underneath (shadow `rgba(139,107,69,0.35)`).
- **Fill**: flat color, at most 2 tones + one small highlight. No gradients, no textures, no realistic shading.
- **Face / dog flavour**: only where it fits (logo, dogs, empty states). Simple dot eyes + tiny nose, never on objects like a calendar.
- **Background**: fully transparent (or plain white if transparent is not possible — we remove it afterwards).
- **Canvas**: square 1:1, object fills ~80% of the canvas, centered, equal padding.
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
Style: cute die-cut sticker icons. Simple rounded silhouette, ONE centered object per image, thick even dark-brown
outline (#4A3628) with rounded corners, flat color fills (max 2 tones plus one small white highlight), a thick white
sticker border around the whole shape, and a very soft warm drop shadow. Warm, friendly, slightly chubby proportions.
No gradients, no textures, no realistic shading, no text or letters, no background (transparent), square 1:1 canvas,
object fills about 80% of the canvas. Light comes from the top-left. Palette: gold #FFC72C, dark brown #4A3628,
white #FFFFFF, plus the accent color I give you per icon. Icons must stay recognizable at 32 px.

First, create a style reference sheet: 6 icons in a 3x2 grid (a paw print, a suitcase, a calendar, a light bulb,
a map pin, a dog face) so I can approve the style. Do not continue until I approve.
```

## Then, per batch (reuse the approved sheet as the anchor)

Always: "Use exactly the same style, line weight, corner roundness, shadow and light direction as the approved
reference sheet. One icon per cell, 3x3 grid, same size, centered, transparent background."

Batches (4–9 icons at a time keeps them consistent):

1. **Navigation**: paw-print logo (gold), suitcase (trips, gold + brown), dog face (dogs), gear (settings), user avatar placeholder (circle with a smiley face), calendar (plan), light bulb (ideas), two people (members).
2. **Categories** (accent color in brackets): pine tree / hiking boot (outdoors, green), fork & plate (food, orange), coffee cup (coffee, brown), camera (sights, purple), shopping bag (shopping, pink), wine glass (drinks, wine red), party popper (fun, mustard), small house / bed (stay, blue), car (transit, gray).
3. **Weather**: sun, partly cloudy, cloud, rain, thunderstorm, snow, fog (sky blue + gold, same style).
4. **Map & misc**: numbered pin (stop), hotel pin, idea pin, dog paw bullet, leash, dog bowl, tent.
5. **Empty-state illustrations** (larger, more detail allowed): a happy dog with a suitcase, a dog looking at a map, a dog with a calendar.

## How to prompt each batch (template)

```
Same style as the approved reference sheet (cute die-cut sticker, thick dark-brown #4A3628 outline, white sticker
border, flat fills, soft shadow, light from top-left, transparent background, 1:1, no text).
Make a 3x3 grid of 9 separate icons, each centered with equal padding:
1) <icon> — accent <color>
2) ...
```

## Tips to keep the set consistent

- Do everything in **one chat** so ChatGPT can see the approved sheet; don't start new chats for new batches.
- If an icon drifts, reply "Redo #4 only, match the line thickness and corner roundness of the reference sheet".
- Ask for a **grid** (many icons per image) instead of separate images: it is much more consistent.
- Check at small size: shrink the result to 32 px and see if each icon is still readable. Simplify if not.
- Export: ask for "transparent PNG, 1024×1024 per icon"; we crop the grid into single files afterwards. If the
  background is not transparent, remove it with any background-remove tool.
- Keep file names like `nav-trips.png`, `cat-food.png`, `wx-rain.png`, `map-pin-stop.png` in `pawtrip/assets/icons/`.

## What I (Claude) do after you have the images

1. Crop the sheets into single files, trim padding, make 1x/2x/3x sizes.
2. Put them in `pawtrip/assets/icons/` and replace the emoji in the rail, sections, categories, weather and map pins.
3. Check light and dark mode (the white sticker border keeps them readable on dark).
