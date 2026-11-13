# Paw product logo system — brief for ChatGPT image generation

Every product has **its own logo, all built from the same system**. Each logo writes the **full product word** (Trip, Feel,
Bowl, ...) and **one letter of that word is built into a paw print without losing its own shape**. The paw lives inside the letter (its
counter or its dot), so the logo is the word and the brand at once. What makes them one family: the same lettering style, the same way of turning a letter into a paw, the same
base shape, and one color per product. Flat, modern, brand-like — not the in-app sticker icon style.

Decided: **flat modern · the full product word written out · one letter keeps its own letterform and grows paw features · one color
per product · same type, same rules.** The final artwork is redrawn by us as exact SVG with real type (AI is for exploring concepts; AI-drawn
letters are unreliable).

## How a letter becomes a paw (shape-preserving — not a paw pasted on top)

**The letter must keep its own shape** (same stroke weight, height, width and outline as its neighbours, so it still reads as that
letter) and **the paw grows out of the letter's own structure**. Never just swap in a separate paw icon. Pick the roundest letter
(o, e, a); if the word has none, use the i.

| Letter | How the paw is built into it |
|---|---|
| **o** | Keep the round ring. The **counter (the hole in the middle) is shaped like a paw print**: one pad plus four small toe beans, cut out as negative space, so the ring still looks like an o. |
| **e** | Keep the e: the same bowl and crossbar. The **small hole of the e is a paw pad** and **four small toe beans sit as dots around/above it** inside the letter's outline; the letter outline stays an e. |
| **a** | Keep the single-story a (round bowl + stem). The **bowl's counter is a paw pad with toe beans** as negative space, stem unchanged. |
| **i** | Keep the stem. The **dot of the i is a small paw print** (one pad + four toes) in the same weight. |

Examples by product: **Bowl** → the o's counter is a paw; **Feel** → one e's counter is a paw pad with toe dots; **Trip** → the i's dot
is a paw; later **Walk / Play** → the a's counter is a paw.

Rules: the paw detail is **negative space or the same flat color** as the letter (no extra color, no outline); stroke weight of the
letter is identical to its neighbours; the paw must be recognizable as a paw even at 60 px (simplify to a pad + four dots if needed);
the word must still read perfectly with the paw details hidden.

## The system (identical in every product logo)

- **Lettering**: bold rounded sans-serif (Nunito ExtraBold style), same letter size, baseline and spacing rules in every logo.
- **The paw-letter**: the letter keeps its own shape and grows a compact, symmetric paw (one pad + four toes) in its counter or dot,
  flat, same color as the other letters, drawn the same way in every product.
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
Core idea: each logo writes the FULL product word, correctly spelled ("Trip", "Feel", "Bowl"), and exactly ONE letter of the
word is built into a paw print WITHOUT losing its own letter shape. The letter keeps its normal outline, stroke weight, height
and width, so it still reads clearly as that letter, and the paw grows out of the letter's own structure:
- "Bowl": the round "o" keeps its ring shape; its inner hole (counter) is cut out in the shape of a paw print (one pad plus
  four small toe beans) as negative space.
- "Feel": one "e" keeps the e shape and crossbar; the small hole of the e is a paw pad with four tiny toe beans.
- "Trip": the "i" keeps its stem; the dot of the i is a small paw print (a pad plus four toes).
Never paste a separate paw icon in place of a letter. The paw detail is negative space or the same flat color as the letter
(no extra color, no outline). The paw must stay recognizable as a paw and the word must read perfectly at a glance.
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
perfect geometry and symmetry, equal letter spacing, identical letter size and baseline in all three logos, keep each paw letter
exactly the height, width and stroke weight of its neighbours with its own letter shape fully intact (the paw lives in its
counter or dot, never replaces the letter), so the word reads as one word, clean smooth curves, words correctly
spelled ("Trip", "Feel", "Bowl"). Flat, no outlines, no gradients, no shadows, no glow, no text other than the product
words. Show the three logos side by side on a pure white (#FFFFFF) background with wide margins, no stray specks.
Output ONE image.
```

## Prompt 3 — does it scale? (attach the chosen logos)

```
Using exactly the same system as the attached logos (same layout, lettering style, size, and the same shape-preserving way of building a
paw into the roundest letter's counter), add two more products: "Walk" in green #6CC48A (the a keeps its shape, its counter is a paw) and "Play" in blue
#7DB6D0 (the a keeps its shape, its counter is a paw). Show all five logos side by side on pure white (#FFFFFF), no other text, no stray specks,
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
2. Does the letter keep its own shape (outline, stroke weight, size) so it reads as that letter — and can you still read the word
   when the paw detail is ignored? (If not, choose another letter or simplify the paw.)
3. Side by side: do Trip / Feel / Bowl look like one family (same type, same method) and yet instantly different?
4. Are all words spelled correctly, with identical letter size and baseline? Is the spacing around the paw-letter equal?
5. Does it look like a brand (calm, confident, geometric) rather than a sticker or emoji?
6. Does it work in one color (all brown / all white)?

## Lessons from earlier rounds (built into the prompts)

- White background only; no magenta, no checkerboard. Each logo fully inside its cell with wide margins, nothing crossing cells.
- Don't put a small symbol (pin, compass, heart) into a paw pad — it looked wrong.
- Two letters alone (Tr / Fe / Wa) are not enough: people would be confused, so the full word is written.
- A pasted-on paw in place of a letter hurts readability: the letter must keep its shape and the paw is built into its counter/dot.
- Replacing the "a" of the constant word "Paw" was considered; now the paw replaces a letter of each product word instead, so each
  logo is distinct and the word itself carries the brand.
- Several concepts in one image are good for exploring; refine ONE image at a time, and edit rather than redraw.
- AI is unreliable at letters: always check spelling. The final letters are set by us in real type.
