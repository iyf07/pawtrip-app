# Paw product logo system — brief for ChatGPT image generation

**How we use ChatGPT: no attachments, every time a fresh generation.** Each prompt below is self-contained: it starts with the
same **STYLE SPEC** (paste it at the top of every request), then adds the request. Because nothing is attached, the spec
describes the cute paw, the lettering, the colors and the rules in words.

Every product has **its own logo, built from the same system**: a rounded-square tile, the cute paw, and the **full product word**
(Trip, Feel, Bowl, ...) in **special lettering**, where **one letter keeps its own shape and has a paw built into it**.

Decided so far:
- **The cute glossy paw** (described in the spec) stays.
- **Full product word**, never just two letters. One letter keeps its shape and grows paw features (counter or dot).
- **Special lettering**, not a plain sans-serif (plain Nunito-like type looked too ordinary).
- **Nice background colors**: warm cream, deep cocoa, soft pastels. **Not gold, not orange, not saturated colors.**
- The final artwork is redrawn by us as exact SVG with a real font (candidates in `docs/logo-explore/font_specimen.png`).

## STYLE SPEC — paste this at the top of EVERY request

```
STYLE SPEC for a family of dog apps called "Paw ___" (Paw Trip, Paw Feel, Paw Bowl).

THE PAW (must look exactly like this every time): a cute, chubby paw print drawn as a glossy die-cut sticker. Four plump oval
toe beans (the two outer ones tilted outward, the two inner ones upright) in a gentle arc above one large soft rounded pad
(a rounded triangle with a soft, slightly heart-like bottom). Everything is filled with warm gold (#FFC72C, slightly warmer
toward the bottom), with a thick, even, dark-brown (#4A3628) outline with rounded corners, a clean thick white sticker edge
around the whole silhouette, and one glossy white highlight (a short curved stripe plus a tiny dot) on the upper left of the
big pad. Friendly, warm, cute. No shadow, no gradient other than the subtle warm gold shift.

THE LETTERING (special, characterful, NOT a plain sans-serif): very bold, soft, rounded, friendly letters with quirky details —
a slightly bouncy baseline, letters of gently different heights, curvy w / a / g, tight candy-like spacing. Two styles:
  "chunky bubble": solid fill, no outline (dark brown #4A3628 on light tiles, cream #FFF4D6 on dark tiles);
  "sticker lettering": gold (#FFC72C) letters with a thick dark-brown (#4A3628) outline, a small white glossy highlight on each
  letter and a thin white sticker edge around the whole word — made of the same material as the paw.

THE PAW INSIDE A LETTER: in each product word exactly ONE letter keeps its own shape (same stroke weight, height, width, so it
still reads clearly as that letter) and has a paw built into it. Never paste a separate paw icon over a letter.
  "o": the round ring stays; its inner hole is cut out in the shape of a paw print (one pad + four tiny toe beans).
  "e": the e stays (bowl + crossbar); its small hole is a paw pad with four tiny toe beans around it.
  "a": the single-story a stays; the hole of its bowl is a paw pad with tiny toe beans.
  "i": the stem stays; the dot of the i is a small paw print (pad + four toes).
The paw detail is negative space or the same color as the letter. The word must read perfectly with the paw ignored.

THE TILE: a rounded square (same corner radius for all). The cute paw sits above the word, the full product word below it,
centered. Tile colors are soft and pleasant only: warm cream #FFF4D6, deep cocoa #4A3628, soft blush #FBD6E4, soft peach #FFD9B8,
soft mint #D7F0DF, soft sky #CFE8F5. NEVER gold, orange or saturated colors as a tile background.

OUTPUT RULES: flat vector-like finish, crisp edges, no text other than the logo's own product words, words correctly spelled.
Outside the tiles: pure white (#FFFFFF), each tile fully inside its own cell with at least 12% empty margin, nothing crossing
cells, no grid lines, no labels, no stray specks. Each logo must stay readable at 60 px.
```

## Request 1 — explore the look (spec + this)

```
[paste the STYLE SPEC above]

REQUEST: Product logos for "Trip", "Feel" and "Bowl". Make one square image with 4 rows x 3 columns; each row shows the three
logos (Trip, Feel, Bowl) side by side:
Row 1: warm cream tile, "chunky bubble" lettering in dark brown.
Row 2: warm cream tile, "sticker lettering" (gold letters, dark-brown outline, white glossy highlights, thin white edge).
Row 3: deep cocoa tile, "chunky bubble" lettering in cream.
Row 4: deep cocoa tile, "sticker lettering".
Paw in the letter: Trip = the dot of the i; Feel = the second e; Bowl = the o.
For Feel use a soft blush tile and for Bowl a soft peach tile in rows 1 and 2 (text dark brown / berry #7A2E4E); keep rows 3 and 4
cocoa for all three.
```

## Request 2 — regenerate the one you liked, cleaner (spec + this; nothing attached)

Describe the winner by its row (and anything you noticed), because nothing is attached:

```
[paste the STYLE SPEC above]

REQUEST: Generate only the style of "row <N>" (<cream|cocoa> tile, <chunky bubble|sticker lettering>), for Trip, Feel and Bowl
side by side in ONE image on pure white, large, with wide margins. Make it cleaner and more precise than before: even letter
spacing, identical letter size and baseline logic in all three, perfectly smooth shapes, the letter that holds the paw keeps
exactly its height, width and stroke weight, all words correctly spelled ("Trip", "Feel", "Bowl").
<optional: extra notes, e.g. "make the paw above 20% bigger", "make the lettering even chunkier">
```

## Request 3 — more products, same system (spec + this)

```
[paste the STYLE SPEC above]

REQUEST: Same system as before, <cream|cocoa> tile, <chunky bubble|sticker lettering>. Show five logos side by side in one image:
"Trip", "Feel", "Bowl", "Walk" (the a holds the paw; soft mint tile #D7F0DF, text #2F6B45) and "Play" (the a holds the paw; soft
sky tile #CFE8F5, text #2F5D74). Same paw, same lettering style, same sizes and positions in all five. Words correctly spelled.
```

Tip: because there is no attachment, results can drift between requests. Keep it in the **same chat** (ChatGPT remembers its
earlier pictures) and say "same as the previous image, but ...". If the paw drifts, re-paste the THE PAW paragraph.

## What I do afterwards

- Choose the real font that matches the chosen lettering (Bagel Fat One is closest to "chunky bubble"), redraw the whole logo as
  **exact SVG** (spelling, spacing, tile, paw-in-letter), export app icons (1024), favicon (the paw), store assets, one-color
  and horizontal versions. The in-app paw stays `pawtrip/assets/icons/masters/logo-paw.png` until the SVG is ready.
- A `Logo` component: `<Logo product="trip" />`; a new product = a word, a tile color, and which letter holds the paw.

## Checks before approving

1. Is the paw cute and the same in every logo? Is the background pleasant (cream/cocoa/soft pastel)?
2. Does the lettering look special (not a default font) and match the paw's material?
3. Does the letter with the paw keep its own shape, and can you read the word without noticing the paw?
4. Spelling correct, identical size/baseline across the three? Readable at 60 px / 32 px?
5. Side by side: one family, each instantly different?

## Lessons from earlier rounds (built into the spec)

- White surround only (no magenta, no checkerboard). Each logo fully inside its cell with wide margins.
- Don't put a small symbol (pin, compass, heart) into a paw pad. Two letters alone are not enough: write the full word.
- A plain sans-serif looked ordinary; gold/orange tile backgrounds looked unattractive and hid the gold paw.
- A pasted-on paw in place of a letter hurts readability: the letter keeps its shape and the paw lives in its counter/dot.
- No attachments: every prompt carries the full spec. AI letters can be misspelled: always check.
