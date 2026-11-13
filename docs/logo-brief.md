# Paw product logo family — brief for ChatGPT image generation

**No attachments, every request is a fresh generation.** Each request below is self-contained: paste the STYLE SPEC first, then the REQUEST.

## The idea (decided)

- **Pure symbol, no text at all.** Each product's logo is only a picture.
- **One shared paw**: every logo is the same paw print — four toe beans in the same arrangement, same size and shape. Only the **big
  pad at the bottom** is different for each product: it is turned into a **product symbol cut out as an empty (white) shape**.
- **Only two colors per logo**: the paw color + white. The background is always **pure white**, and the cut-out shape is white too,
  so the hollow symbol **merges with the white background** — the symbol opens through the bottom edge of the pad into the
  background, so it reads as one continuous white shape.
- **One color per product** (the paw's color), background always white.
- Simple, flat, minimal; it must not look AI-generated (no gloss, outline, gradient, shadow, sticker edge, texture).
- Final artwork: we redraw it as exact SVG (the paw geometry is identical in all logos, only the cut-out changes).

## Products and colors (proposal — tell us if you want to change one)

| Product | Paw color | The pad becomes (hollow, white, opens to the background below) |
|---|---|---|
| Paw Trip | warm amber gold `#FFB400` (close to the current gold paw, slightly deeper to read on white) | a trip symbol — **ChatGPT proposes many options, you pick** |
| Paw Feel | rose pink `#F25C8A` | a **heart** |
| Paw Bowl | teal blue `#2FA4B8` | a **dog bowl** |
| later: Paw Walk | fresh green `#4CAF6A` | e.g. a leash loop / footprints |
| later: Paw Play | violet `#8A6BE0` | e.g. a ball |

## How the hollow works (be precise)

The big pad is a solid rounded shape in the product color. Inside it, the product symbol is **cut out in white**. The cut-out
**continues down through the bottom edge of the pad**, so the white symbol is connected to the white background below the paw
(no closed hole): the pad looks like it has a notch in the shape of the symbol. For Paw Feel: a white heart whose bottom point
runs out through the pad's lower edge into the background. For Paw Bowl: the white bowl shape sits low in the pad and its base
opens to the background. The four toe beans stay solid.

## STYLE SPEC — paste at the top of EVERY request

```
STYLE SPEC for a family of dog-app logos, "Paw ___" (Paw Trip, Paw Feel, Paw Bowl).

EACH LOGO IS A PURE SYMBOL: no text, no letters, no words at all. Pure white (#FFFFFF) background. Only TWO colors in the whole
logo: one product color and white. Flat solid shapes only: NO outlines, NO strokes, NO gradients, NO shadows, NO glow, NO glossy
highlights, NO textures, NO sticker edge, NO 3D. Minimal, precise, simple geometry, like a professional brand symbol by a human
designer. It must not look AI-generated.

THE SHARED PAW (identical in every logo): a cute, chubby paw print made of four plump oval toe beans arranged in a gentle arc
(the two outer toes tilted outward, the two inner toes upright) above one large, soft, rounded pad. The four toe beans are the
same size, shape and position in every logo.

THE PAD IS THE PRODUCT SYMBOL: the big pad at the bottom is a solid rounded shape in the product color with the product symbol
CUT OUT of it as white (empty) space. The cut-out symbol is white, exactly the same white as the background, and it runs out
through the bottom edge of the pad, so the hollow symbol is connected to the white background below the paw — it merges with the
background (it is NOT a closed hole). The four toe beans stay solid.

LAYOUT: the paw is centered, filling about 70% of a square image, with wide white margins. Crisp vector-like edges.
When showing several variations, use a grid on pure white, each variation fully inside its own cell with at least 15% empty
margin, nothing crossing cells, no grid lines, no stray specks; a small dark-gray number under each cell is allowed (for choosing).
```

## Request 0 — EVERYTHING AT ONCE (use this first: paste the STYLE SPEC, then this)

ChatGPT tends to do only the first item and stop (it once drew only the heart). This request lists every product, gives a fixed
count per row, and tells it explicitly not to stop.

```
[paste the STYLE SPEC above]

REQUEST: Generate ALL of the following in ONE square image, as a grid with 4 columns x 4 rows (16 cells), every cell a different
logo variation, numbered 1-16 with a small dark-gray number under each cell. Do NOT skip any row and do NOT stop after the first
row — all 16 cells must be filled. Do not ask me any questions; just generate.

ROW 1 (cells 1-4) = Paw FEEL. Product color rose pink #F25C8A. The pad has a white HEART cut out whose bottom point runs out
through the bottom edge of the pad into the white background. The four cells differ in heart size, round vs slightly pointed
heart, and how much solid pink remains around it.

ROW 2 (cells 5-8) = Paw TRIP. Product color warm amber gold #FFB400. The pad has a white travel symbol cut out, running out
through the bottom edge into the white background. Cell 5 map pin, 6 suitcase, 7 compass, 8 airplane.

ROW 3 (cells 9-12) = Paw TRIP (more options). Same amber #FFB400. Cell 9 mountains with a sun, 10 winding road, 11 tent,
12 hot-air balloon.

ROW 4 (cells 13-16) = Paw BOWL. Product color teal blue #2FA4B8. The pad has a white DOG BOWL cut out, opening out through the
bottom edge into the white background. Cell 13 simple bowl, 14 bowl with a small mound of kibble, 15 bowl with a bone shape,
16 deeper bowl.

All 16 logos use the exact same paw (same four toe beans, same size and positions); only the pad cut-out changes. Only two colors
per logo (its product color + white). No text except the small gray numbers.
If you cannot fit all 16 cleanly in one image, make TWO images in a row without asking: image A = rows 1 and 4 (Feel and Bowl),
image B = rows 2 and 3 (Trip), keeping the same numbering.
```

After you choose, use the single-product requests below to refine one logo at a time, or **Request 5** for the next products.

## Request 1 — Paw Feel (rose pink `#F25C8A`, heart)

```
[paste the STYLE SPEC above]

REQUEST: Paw Feel logo. Product color rose pink #F25C8A on a white background. The big pad has a white HEART cut out of it; the
heart's bottom point runs out through the bottom edge of the pad into the white background, so the white heart merges with the
background. Make a 2x2 grid of 4 variations that differ only in heart size, heart shape (round vs slightly pointed) and how
much of the pad's solid color remains around it. Number them 1-4.
```

## Request 2 — Paw Trip (amber `#FFB400`) — many options to choose from

```
[paste the STYLE SPEC above]

REQUEST: Paw Trip logo. Product color warm amber gold #FFB400 on a white background. The big pad has a white TRIP-RELATED symbol
cut out of it, running out through the bottom edge of the pad into the white background. Make a 4x3 grid of 12 variations, each
with a different symbol, the most recognizable and representative ones for travel, each simplified to one bold shape that reads at
a small size: 1 map pin, 2 suitcase, 3 compass, 4 airplane, 5 mountains with a sun, 6 winding road, 7 tent, 8 hot-air balloon,
9 camper van, 10 hiking boot, 11 paper plane, 12 route line with a dot at each end. Number them 1-12. All with the same paw, same
toes, same amber color.
```

## Request 3 — Paw Bowl (teal `#2FA4B8`, dog bowl)

```
[paste the STYLE SPEC above]

REQUEST: Paw Bowl logo. Product color teal blue #2FA4B8 on a white background. The big pad has a white DOG BOWL cut out of it
(a simple bowl shape: a rounded bowl with a flat rim line), opening out through the bottom edge of the pad into the white
background. Make a 2x3 grid of 6 variations: 1 simple bowl, 2 bowl with a small mound of kibble on top, 3 bowl with a bone
shape on its side, 4 deeper bowl, 5 wide shallow bowl, 6 bowl seen slightly from above with a visible rim. Number them 1-6.
```

## Request 4 — refine the one you chose (paste the spec + this; no attachment)

```
[paste the STYLE SPEC above]

REQUEST: Generate ONLY the "<Feel|Trip|Bowl>" logo with <describe the chosen variation, e.g. "variation 3: a round heart, 40% of the
pad's width">. One image, very clean and precise: perfectly smooth curves, the four toe beans identical in size and spacing,
the cut-out symbol exactly centered and running out through the bottom of the pad. <optional notes>
```

## Request 5 — the next products (same system; paste the spec + this)

```
[paste the STYLE SPEC above]

REQUEST: One square image, grid 4 columns x 2 rows (8 cells), numbered 1-8, all different variations, same paw in every cell:
ROW 1 = Paw WALK, product color fresh green #4CAF6A: cells 1 leash loop with a handle, 2 two small footprints, 3 a winding path,
4 a dog on a leash silhouette (simple, one bold shape).
ROW 2 = Paw PLAY, product color violet #8A6BE0: cells 5 ball, 6 bone, 7 frisbee, 8 squeaky toy.
Do not stop after the first row; fill all 8 cells; do not ask questions.
```

Tip: stay in the **same chat** (ChatGPT remembers earlier images) and say "same as the previous image, but ...". If shine, outlines
or shadows creep in, paste the first paragraph of the STYLE SPEC again.

## What I do afterwards

- Redraw the family as **exact SVG**: one paw (same toes in every logo) and one pad per product with the symbol cut out. Perfect
  geometry, only two colors, then export app icons (1024), favicon, store assets, one-color and dark-mode versions.
- A `Logo` component: `<Logo product="feel" />`; a new product = a color and a pad symbol.
- Swap into the left rail, mobile navbar, sign-in, splash, favicon and the app icon.

## Checks before approving

1. Is it a pure symbol (no text), two colors, white background, no gloss/outline/shadow?
2. Is the paw identical across products (toes the same), with only the pad symbol different?
3. Does the white cut-out merge with the background (open at the bottom), not a closed hole?
4. Is the symbol recognizable at 32 px? (Heart, bowl, pin ... must read instantly.)
5. Side by side: one family, each instantly different by color and symbol?

## Lessons from earlier rounds

- No wordmarks and no letters: the symbol alone is simpler and cannot be misspelled by AI.
- Don't put a separate small symbol *inside* a closed pad (looked wrong); instead the symbol is the pad's white cut-out that opens to the background.
- Gold/orange backgrounds looked unattractive: the background is always white now.
- Gloss, white sticker edges, outlines and wobbly shapes read as AI-generated: flat, two colors, precise geometry.
- No attachments: every request carries the full spec.
