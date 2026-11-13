# Paw product logo system — brief for ChatGPT image generation

Every product has **its own logo, all built from the same system**. Each logo writes the **full product word** (Trip, Feel,
Bowl, ...) and **one letter of that word is a paw print**. The paw is part of the lettering, so the logo is the word and the
brand at once. What makes them one family: the same lettering style, the same way of turning a letter into a paw, the same
base shape, and one color per product. Flat, modern, brand-like — not the in-app sticker icon style.

Decided: **flat modern · the full product word written out · one letter of the word is a paw print · one color per product ·
same type, same rules.** The final artwork is redrawn by us as exact SVG with real type (AI is for exploring concepts; AI-drawn
letters are unreliable).

## Which letter becomes the paw (one rule for every product)

**The roundest letter of the word (o, e, a) becomes the paw print. If the word has no round letter (e.g. "Trip"), the dot of the
"i" becomes the paw.** The paw takes exactly the place of that letter: same height and baseline, similar visual weight, equal
letter spacing, so the word still reads as the word at a glance.

| Product | Word | Paw replaces | Result |
|---|---|---|---|
| Paw Trip | Trip | the dot of the **i** (or the i itself) | Tr🐾p-style: the i's dot is a small paw |
| Paw Feel | Feel | one of the **e**s (second e preferred) | Fe🐾l |
| Paw Bowl | Bowl | the **o** | B🐾wl |
| Paw Walk (later) | Walk | the **a** | W🐾lk |
| Paw Play (later) | Play | the **a** | Pl🐾y |

Whichever letter we choose, the word must be perfectly readable (test with the paw hidden — people should still read the word).

## The system (identical in every product logo)

- **Lettering**: bold rounded sans-serif (Nunito ExtraBold style), same letter size, baseline and spacing rules in every logo.
- **The paw-letter**: a compact, symmetric paw print (four toes + one pad), flat, same color as the other letters (or the product
  accent color to make it pop), the same drawing in every product.
- **Color**: one main color per product, the rest dark brown `#4A3628` and white. Trip gold `#FFC72C`, Feel pink `#E68AB3`,
  Bowl orange `#F0904E`, Walk green `#6CC48A`, Play blue `#7DB6D0`.
- **Base shape** (app icon version): the same rounded square, same corner radius; word centered, big.
- **"Paw" brand word**: the paw-letter already says "Paw". For store listings and headers we also write "Paw" small above or
  before the word (Paw Trip), always in the same place and style.
- **Style**: flat solid shapes only. No outlines, no gradients, no shadows, no glow, no 3D, no sticker border, no texture.
- Must be legible at 60 px (phone home screen); the paw alone is the 16 px favicon.

## Four layouts to explore (pick one)

1. **Tile, word only** — rounded square in the product color; the product word big across the middle with its paw-letter. No other text.
2. **Tile + small "Paw"** — same, with a small "Paw" label above the word (always same size and place).
3. **Horizontal wordmark** (no tile) — "Paw" in dark brown followed by the product word in the product color with its paw-letter, on one
   line. For headers, website, store banners.
4. **Hero paw-letter** — rounded square; the word big, with the paw-letter slightly larger / in a contrasting color (white on color,
   or dark brown on gold) so the paw pops.

## Prompt 1 — explore: 4 layouts × 3 products (new chat, no attachments)

```
Design a product logo system for a family of dog apps called "Paw ___": Paw Trip, Paw Feel, Paw Bowl.
Core idea: each logo writes the FULL product word, correctly spelled ("Trip", "Feel", "Bowl"), and exactly ONE letter of
the word is replaced by a paw print: the roundest letter becomes the paw ("Bowl": the o; "Feel": the second e); in
"Trip" there is no round letter, so the dot of the i is a small paw print. The paw takes exactly the place of that
letter: same height and baseline as the other letters, equal letter spacing, a compact symmetric paw (four toes + one pad),
flat, same color as the other letters. The word must still be perfectly readable at a glance.
All logos use the same system: one bold rounded sans-serif (like Nunito ExtraBold), same letter size and baseline rules,
the same way of turning a letter into a paw.
Colors: Trip = gold #FFC72C, Feel = pink #E68AB3, Bowl = orange #F0904E as the main color; letters in dark brown #4A3628
or white. Flat, modern, minimal: solid shapes only, NO outlines, NO strokes, NO gradients, NO shadows, NO glow, NO 3D,
NO sticker border, NO texture.
Show 4 different layouts, one per row, each row showing the three logos (Trip, Feel, Bowl) side by side:
Row 1: rounded square in the product color; the product word big across the middle with its paw-letter, nothing else.
Row 2: same, plus a small "Paw" label above the word.
Row 3: no square; one line: "Paw" in dark brown followed by the product word in the product color with its paw-letter.
Row 4: rounded square; the word big, with the paw-letter slightly larger and in a contrasting color so the paw pops.
Pure white (#FFFFFF) background, each logo fully inside its own cell with at least 15% empty margin, nothing crossing
cells, no grid lines, no row labels, no text other than each logo's own words, no stray specks. 4 rows x 3 columns in one
square image. All words correctly spelled and readable at 60 px.
```

## Prompt 2 — refine the chosen layout (attach the image; ONE image per request)

```
Take the attached logo system, layout in row <N>. Keep the concept, colors and lettering style EXACTLY. Improve only:
perfect geometry and symmetry, equal letter spacing, identical letter size and baseline in all three logos, make each paw
letter exactly the height and weight of its neighbours so the word reads as one word, clean smooth curves, words correctly
spelled ("Trip", "Feel", "Bowl"). Flat, no outlines, no gradients, no shadows, no glow, no text other than the product
words. Show the three logos side by side on a pure white (#FFFFFF) background with wide margins, no stray specks.
Output ONE image.
```

## Prompt 3 — does it scale? (attach the chosen logos)

```
Using exactly the same system as the attached logos (same layout, lettering style, size, and the same way of turning the
roundest letter into a paw), add two more products: "Walk" in green #6CC48A (the a becomes the paw) and "Play" in blue
#7DB6D0 (the a becomes the paw). Show all five logos side by side on pure white (#FFFFFF), no other text, no stray specks,
words correctly spelled. Output ONE image.
```

## What I do afterwards

- Redraw the chosen system as **exact SVG** (real Nunito ExtraBold letters, perfectly spelled, identical size and baseline, one
  paw drawing placed exactly where the letter was), then export app icons (1024), favicon (the paw alone), store assets,
  one-color versions and the horizontal wordmark.
- A `Logo` component: `<Logo product="trip" layout="icon" | "horizontal" />`; adding a product = a word, a color, and which
  letter becomes the paw.
- Swap them into the left rail, mobile navbar, sign-in, splash, favicon and the app icon.

## Checks before approving

1. At 60 px and 32 px: is the word still readable? Is the paw still clear as a paw?
2. Hide the paw with your thumb: can you still read the word? (If not, choose another letter.)
3. Side by side: do Trip / Feel / Bowl look like one family (same type, same method) and yet instantly different?
4. Are all words spelled correctly, with identical letter size and baseline? Is the spacing around the paw-letter equal?
5. Does it look like a brand (calm, confident, geometric) rather than a sticker or emoji?
6. Does it work in one color (all brown / all white)?

## Lessons from earlier rounds (built into the prompts)

- White background only; no magenta, no checkerboard. Each logo fully inside its cell with wide margins, nothing crossing cells.
- Don't put a small symbol (pin, compass, heart) into a paw pad — it looked wrong.
- Two letters alone (Tr / Fe / Wa) are not enough: people would be confused, so the full word is written.
- Replacing the "a" of the constant word "Paw" was considered; now the paw replaces a letter of each product word instead, so each
  logo is distinct and the word itself carries the brand.
- Several concepts in one image are good for exploring; refine ONE image at a time, and edit rather than redraw.
- AI is unreliable at letters: always check spelling. The final letters are set by us in real type.
