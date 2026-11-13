# Paw product logo system — brief for ChatGPT image generation

Every product has **its own logo, all built from the same system**, and each logo **spells out the full product name**
(Travel, Feel, Walk) so nobody has to guess. What makes them one family: the same base shape, the same paw element in the
same place, the same lettering style and size, and one color per product. Flat, modern, brand-like — not the in-app
sticker icon style.

Decided: **flat modern · full product word written out (Travel / Feel / Walk) · a paw element in every logo · one color per
product · same base, same type, same positions.** The final artwork is redrawn by us as exact SVG with real type
(AI is for exploring concepts; AI-drawn letters are unreliable).

## The system (what is identical in every product logo)

- **Base shape**: the same rounded square (same corner radius) for the app-icon version.
- **Paw element**: the same paw print (same shape, size, position) in every logo.
- **Product word**: the full word, **Travel**, **Feel**, **Walk** (later **Play**, **Eat**, ...), one bold rounded sans-serif
  (Nunito ExtraBold style), **same letter size, same baseline, same position in every logo** — sized so the longest word
  ("Travel") fits with comfortable margins; shorter words simply have more space around them. Names of about 7 letters or
  fewer keep the system consistent.
- **Brand word "Paw"**: the paw print itself stands for "Paw". The horizontal version also writes "Paw" in full next to the
  product word, so the full name "Paw Travel" is always readable.
- **Color**: one main color per product; the rest in dark brown `#4A3628` and white. Travel gold `#FFC72C`, Feel pink
  `#E68AB3`, Walk green `#6CC48A`, Play blue `#7DB6D0`, Eat orange `#F0904E`.
- **Style**: flat solid shapes only. No outlines, no gradients, no shadows, no glow, no 3D, no sticker border, no texture.
- Legible at 60 px (phone home screen); the paw alone (without the word) is the 16 px favicon.

## Four ways to combine paw + word (explore all four, then pick one)

1. **Paw above the word** — rounded square in the product color; the paw print on top, the full product word big beneath it.
   Clear and consistent, like a classic app icon.
2. **Big paw watermark behind the word** — rounded square in the product color; a large paw silhouette in a lighter/darker
   tone of the same color fills the tile behind; the product word in big letters across the middle. Playful and rich, still flat.
3. **Paw cut-out corner** — rounded square with a paw-shaped notch bitten out of the top-right corner; the product word
   centered. Clean and modern.
4. **Horizontal lockup** (no tile) — paw print on the left, then "Paw" in dark brown and the product word in the product color,
   side by side on one line (or "Paw" small above the product word). For headers, website, app store banners.

## Prompt 1 — explore the system: 4 concepts × 3 products (new chat, no attachments)

```
Design a product logo system for a family of dog apps called "Paw ___": Paw Travel, Paw Feel, Paw Walk.
Every product has its own logo, all built from the same system, and each logo spells out the FULL product word,
correctly spelled: "Travel", "Feel", "Walk". Every logo also contains the same paw-print element (same shape, size and
position in every logo), so the family is obvious. The word is set in one bold rounded sans-serif (like Nunito ExtraBold),
the same letter size and baseline in every logo, big, perfectly clear and correctly spelled.
Colors: Travel = gold #FFC72C, Feel = pink #E68AB3, Walk = green #6CC48A as the main color; text and paw in dark brown
#4A3628 or white. Flat, modern, minimal: solid shapes only, NO outlines, NO strokes, NO gradients, NO shadows, NO glow,
NO 3D, NO sticker border, NO texture.
Show 4 different concepts, one per row, each row showing the three logos (Travel, Feel, Walk) side by side:
Row 1 "Paw above the word": rounded square in the product color, a paw print on top, the full product word big beneath.
Row 2 "Paw watermark": rounded square in the product color with a large paw silhouette in a slightly different tone of the
same color behind, the full product word big across the middle.
Row 3 "Paw cut-out": rounded square with a paw-shaped notch cut out of the top-right corner, the full product word centered.
Row 4 "Horizontal lockup": no square; a paw print on the left, then the word "Paw" in dark brown followed by the product
word in the product color, on one line.
Pure white (#FFFFFF) background, each logo fully inside its own cell with at least 15% empty margin, nothing crossing
cells, no grid lines, no row labels, no text other than each logo's own words, no stray specks. 4 rows x 3 columns in one
square image. The word must be readable at 60 px.
```

## Prompt 2 — refine the chosen concept (attach the image; ONE image per request)

```
Take the attached logo system, concept in row <N>. Keep the concept, shapes, colors and lettering style EXACTLY. Improve
only: perfect geometry and symmetry, equal spacing, identical letter size/baseline and identical paw size/position in all
three logos, clean smooth curves, letters big and correctly spelled ("Travel", "Feel", "Walk"). Flat, no outlines, no
gradients, no shadows, no glow, no text other than the product words. Show the three logos side by side on a pure white
(#FFFFFF) background with wide margins, no stray specks. Output ONE image.
```

## Prompt 3 — does it scale? (attach the chosen logos)

```
Using exactly the same system as the attached logos (same base shape, paw element, lettering style, size and position), add
two more products: "Play" in blue #7DB6D0 and "Eat" in orange #F0904E. Show all five logos side by side on pure white
(#FFFFFF), no other text, no stray specks, words correctly spelled. Output ONE image.
```

## What I do afterwards

- Redraw the chosen system as **exact SVG** (perfect geometry, real Nunito ExtraBold letters, correct spelling, identical
  size and baseline), then export app icons (1024), favicon (the paw alone), store assets, one-color versions, and the
  horizontal lockup.
- A `Logo` component: `<Logo product="travel" layout="icon" | "horizontal" />`; adding a product = a word + a color.
- Swap them into the left rail, mobile navbar, sign-in, splash, favicon and the app icon.

## Checks before approving

1. At 60 px and 32 px: is the full word still readable? Is the paw still clear?
2. Side by side: do Travel / Feel / Walk look like one family (same shapes, same positions) and yet instantly different?
3. Are all words spelled correctly, with identical letter size and baseline?
4. Does it look like a brand (calm, confident, geometric) rather than a sticker or emoji?
5. Does the paw read as a paw (not as something else)?
6. Does it work in one color (all brown / all white)?

## Lessons from earlier rounds (built into the prompts)

- White background only; no magenta, no checkerboard. Each logo fully inside its cell with wide margins, nothing crossing cells.
- Don't put a small symbol (pin, compass, heart) into a paw pad — it looked wrong.
- Two letters alone (Tr / Fe / Wa) are not enough: people would be confused, so the full word is written.
- Several concepts in one image are good for exploring; refine ONE image at a time, and edit rather than redraw.
- AI is unreliable at letters: always check spelling. The final letters are set by us in real type.
