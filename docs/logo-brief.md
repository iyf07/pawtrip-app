# Paw product logo system (Adobe-style) — brief for ChatGPT image generation

Like Adobe's product icons (Ps, Ai, Pr): **every product has its own logo, all built from the same system**, and each one
**clearly shows letters** that tell you which product it is. Ours: the same paw element + two product letters + one product
color, on the same base shape. Not part of the in-app sticker icon set; flat, modern, brand-like.

Decided: **flat modern · paw element in every logo · two clear product letters · one color per product · same base shape,
same type, same positions.** The final artwork is redrawn by us as exact SVG (AI is for exploring concepts).

## The system (what is identical in every product logo)

- **Base shape**: the same rounded square (or the paw-shaped badge, depending on the concept) with the same corner radius.
- **Letters**: two letters, capital + lowercase (like Adobe's "Ps"): **Tr** (Travel), **Fe** (Feel), **Wa** (Walk), later e.g.
  **Pl** (Play), **Ea** (Eat). Same bold rounded sans-serif, same size, same position and spacing in every logo.
  The letters must be big and perfectly clear — they are what identifies the product.
- **Paw element**: the same paw (same shape, same size, same position) in every logo, so the family is obvious.
- **Color**: one main color per product, used for the base; letters and paw in dark brown `#4A3628` or white.
  Travel gold `#FFC72C`, Feel pink `#E68AB3`, Walk green `#6CC48A`, Play blue `#7DB6D0`, Eat orange `#F0904E`.
- **Style**: flat, solid shapes only. No outlines, no gradients, no shadows, no glow, no 3D, no sticker border, no texture.
- Must read at 16 px, and every logo must look like it belongs to the same family when shown side by side.

## Four ways to combine the paw with the letters (explore all four, then pick one)

1. **Corner paw** — paw in one corner (always the same corner), letters centered. Safest, most consistent, less playful.
2. **Toes above the letters** — the four toe beans sit in a small arc above the letters, like the dots of an "i"; the
   letters sit where the pad would be. Playful, reads as a paw at once.
3. **Paw-shaped badge** — the whole logo base is a paw silhouette (four toes + one big pad); the two letters are written
   big inside the pad. Most distinctive and most "family"; letters must stay large and clear.
4. **Paw cut-out** — a rounded square with a paw-shaped notch bitten out of the top-right corner, letters centered.
   Clean and modern, closest to Adobe.

## Prompt 1 — explore the system: 4 concepts × 3 products (new chat, no attachments)

```
Design a product logo system for a family of dog apps called "Paw ___": Paw Travel, Paw Feel, Paw Walk.
It works like Adobe's product icons (Ps, Ai, Pr): every product has its own logo, all built from the same system,
and each logo clearly shows two letters that identify the product: "Tr" (Travel), "Fe" (Feel), "Wa" (Walk).
Every logo also contains the same paw-print element (same shape, size and position in every logo) so the family is
obvious. Letters: capital first letter + lowercase second letter, bold rounded sans-serif, big, perfectly clear and
correctly spelled, same size and position in every logo.
Colors: Travel = gold #FFC72C, Feel = pink #E68AB3, Walk = green #6CC48A as the main base color; letters and paw in dark
brown #4A3628 or white. Flat, modern, minimal: solid shapes only, NO outlines, NO strokes, NO gradients, NO shadows,
NO glow, NO 3D, NO sticker border, NO texture.
Show 4 different concepts, one per row, each row showing the three logos (Tr, Fe, Wa) side by side:
Row 1 "Corner paw": rounded square, paw in the top-right corner, letters centered.
Row 2 "Toes above letters": four toe beans in a small arc above the letters like the dots of an i; letters where the pad
would be, on a rounded square.
Row 3 "Paw-shaped badge": the whole logo shape is a paw silhouette (four toes + one big pad) and the two letters are
written big inside the pad.
Row 4 "Paw cut-out": rounded square with a paw-shaped notch cut out of the top-right corner, letters centered.
Pure white (#FFFFFF) background, each logo fully inside its own cell with at least 15% empty margin, nothing crossing
cells, no grid lines, no row labels, no text other than the two letters in each logo, no stray specks. Make it
4 rows x 3 columns in one square image. Make each logo readable at 32 px.
```

## Prompt 2 — refine the chosen concept (attach the image; ONE image per request)

```
Take the attached logo system, concept in row <N>. Keep the concept, shapes, colors and letter style EXACTLY. Improve
only: perfect geometry and symmetry, equal spacing, identical letter size/position and identical paw size/position in
all three logos, clean smooth curves, and make the letters even bigger and clearer. Flat, no outlines, no gradients,
no shadows, no glow, no text other than the letters. Show the three logos (Tr, Fe, Wa) side by side on a pure white
(#FFFFFF) background with wide margins, no stray specks. Output ONE image.
```

## Prompt 3 — extra product (to test that the system scales; attach the chosen logos)

```
Using exactly the same system as the attached logos (same base shape, paw element, letter style, size and position),
add two more products: "Pl" (Play) in blue #7DB6D0 and "Ea" (Eat) in orange #F0904E. Show all five logos side by side
on pure white (#FFFFFF), no other text, no stray specks. Output ONE image.
```

## What I do afterwards

- Redraw the chosen system as **exact SVG** (perfect geometry; real Nunito ExtraBold letters), then export every size and
  color version: app icons (1024), favicon (16/32), store assets, one-color versions.
- A `Logo` component: `<Logo product="travel" />` draws the right letters and color; adding a product = two letters + a color.
- Swap them into the rail, mobile navbar, sign-in, splash, favicon and the app icon.

## Checks before approving

1. Shrink to 32 px and 16 px: are the letters still readable and is the paw still clear?
2. Side by side: do Tr / Fe / Wa look like one family (same shapes, same positions) and yet instantly different?
3. Are the letters spelled correctly and identical in size/position across products?
4. Does it look like a brand (calm, confident, geometric) rather than a sticker or emoji?
5. Does the paw read as a paw (not as something else)?
6. Does it still work in one color (all brown / all white)?

## Lessons from earlier rounds (built into the prompts)

- White background only; no magenta, no checkerboard. Each logo fully inside its cell with wide margins, nothing crossing cells.
- Don't put a small symbol (pin, compass, heart) into a paw pad — it looked wrong. Letters are fine because they are the point.
- Several concepts in one image are good for exploring; refine ONE image at a time, and edit rather than redraw.
- AI is unreliable at letters: keep the text to two letters per logo, and always check spelling. Final letters are set by us.
