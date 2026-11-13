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
- **The paw is a letter**: in the brand word **"Paw"**, the letter **a** is replaced by a paw print — **P🐾w** — so the paw is part of the
  lettering, not a separate decoration. It sits exactly where an "a" would: same height (x-height) and baseline as the other
  letters, similar visual weight, same shape in every product. It must still read as "Paw" at a glance.
- **Product word**: the full word, **Travel**, **Feel**, **Walk** (later **Play**, **Eat**, ...), one bold rounded sans-serif
  (Nunito ExtraBold style), **same letter size, same baseline, same position in every logo** — sized so the longest word
  ("Travel") fits with comfortable margins; shorter words simply have more space around them. Names of about 7 letters or
  fewer keep the system consistent.
- **Brand word "Paw"** is always written (with the paw-"a") next to or above the product word, so the full name "Paw Travel" is
  always readable. The paw-"a" is the same in every product, so "Paw" is the constant and the product word is the variable.
- **Color**: one main color per product; the rest in dark brown `#4A3628` and white. Travel gold `#FFC72C`, Feel pink
  `#E68AB3`, Walk green `#6CC48A`, Play blue `#7DB6D0`, Eat orange `#F0904E`.
- **Style**: flat solid shapes only. No outlines, no gradients, no shadows, no glow, no 3D, no sticker border, no texture.
- Legible at 60 px (phone home screen); the paw alone (without the word) is the 16 px favicon.

## Four ways to turn a letter into the paw (explore all four, then pick one)

1. **P🐾w + word, stacked in a tile** — rounded square in the product color; "Paw" with the paw-"a" in the upper part, the full
   product word big beneath it. Clear, consistent, classic app icon.
2. **Horizontal lockup** — one line: **P🐾w** in dark brown followed by the product word in the product color
   ("P🐾w Travel"). For headers, website and store banners.
3. **Paw-letter inside the product word** — the paw replaces the round letter of each product word instead: **Tr🐾vel**
   (a), **F🐾el** (first e) / **Fe🐾l**, **W🐾lk** (a); "Paw" written small above. Each product's own word carries the paw —
   more fun, but readability of the word must stay perfect.
4. **Giant paw-"a" + word** — rounded square; "P🐾w" very large with an oversized paw-"a" as the hero, the product word
   smaller underneath. The most eye-catching icon, uses the paw-letter as the star.

How to draw the paw-letter well: round, compact paw print (four toes + pad, tight and symmetric) filling the same height as the
neighbouring lowercase letters; same stroke-less flat style and color as the other letters (dark brown or white), optionally a
tiny bit bolder; letter spacing equal to the neighbours so "P🐾w" reads as one word, not as a word with an icon.

## Prompt 1 — explore the system: 4 concepts × 3 products (new chat, no attachments)

```
Design a product logo system for a family of dog apps called "Paw ___": Paw Travel, Paw Feel, Paw Walk.
Core idea: in the word "Paw", the letter "a" is replaced by a paw print, so it reads P🐾w (P, then a paw print as the
"a", then w). The paw-print letter sits exactly where an "a" would: the same height and baseline as the lowercase
letters, a compact round paw print (four toes + one pad, tight and symmetric), same flat style and color as the other
letters, equal letter spacing, so "Paw" reads as one word at a glance.
Each product's logo writes the FULL product word, correctly spelled: "Travel", "Feel", "Walk". All logos are built from
the same system: same lettering (bold rounded sans-serif, like Nunito ExtraBold), same sizes, same baselines, same
paw-letter in every logo.
Colors: Travel = gold #FFC72C, Feel = pink #E68AB3, Walk = green #6CC48A as the main color; letters in dark brown #4A3628
or white. Flat, modern, minimal: solid shapes only, NO outlines, NO strokes, NO gradients, NO shadows, NO glow, NO 3D,
NO sticker border, NO texture.
Show 4 different concepts, one per row, each row showing the three logos (Travel, Feel, Walk) side by side:
Row 1: rounded square in the product color; upper part "P🐾w" (paw print as the a), beneath it the full product word big.
Row 2: no square; one line: "P🐾w" in dark brown followed by the product word in the product color.
Row 3: rounded square in the product color; the paw print replaces the round letter inside the product word itself
(Tr🐾vel, F🐾el, W🐾lk) with a small "Paw" above; the full word must stay perfectly readable.
Row 4: rounded square in the product color; "P🐾w" very large with an oversized paw print as the "a", the product word
smaller beneath it.
Pure white (#FFFFFF) background, each logo fully inside its own cell with at least 15% empty margin, nothing crossing
cells, no grid lines, no row labels, no text other than each logo's own words, no stray specks. 4 rows x 3 columns in one
square image. All words correctly spelled and readable at 60 px.
```

## Prompt 2 — refine the chosen concept (attach the image; ONE image per request)

```
Take the attached logo system, concept in row <N>. Keep the concept, shapes, colors and lettering style EXACTLY. Improve
only: perfect geometry and symmetry, equal spacing, identical letter size/baseline in all three logos, make the
paw-print letter exactly the height and weight of its neighbours with equal letter spacing so the word reads as one,
clean smooth curves, letters big and correctly spelled ("Paw", "Travel", "Feel", "Walk"). Flat, no outlines, no
gradients, no shadows, no glow, no text other than the product words. Show the three logos side by side on a pure white
(#FFFFFF) background with wide margins, no stray specks. Output ONE image.
```

## Prompt 3 — does it scale? (attach the chosen logos)

```
Using exactly the same system as the attached logos (same base shape, paw-print letter in "Paw", lettering style, size and position), add
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
2. Does "P🐾w" read as the word "Paw" at a glance (the paw-letter looks like an "a" in height, weight and spacing)?
   And do Travel / Feel / Walk look like one family and yet instantly different?
3. Are all words spelled correctly, with identical letter size and baseline?
4. Does it look like a brand (calm, confident, geometric) rather than a sticker or emoji?
5. Does the paw read as a paw (not as something else)?
6. Does it work in one color (all brown / all white)?

## Lessons from earlier rounds (built into the prompts)

- White background only; no magenta, no checkerboard. Each logo fully inside its cell with wide margins, nothing crossing cells.
- Don't put a small symbol (pin, compass, heart) into a paw pad — it looked wrong.
- Two letters alone (Tr / Fe / Wa) are not enough: people would be confused, so the full word is written.
- Turning a letter into the paw works best on the constant word "Paw" (the "a"); replacing letters inside each product word is
  fun but risks readability, so it is tested as one of the concepts only.
- Several concepts in one image are good for exploring; refine ONE image at a time, and edit rather than redraw.
- AI is unreliable at letters: always check spelling. The final letters are set by us in real type.
