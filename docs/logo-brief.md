# Paw product logo system — brief for ChatGPT image generation

Every product has **its own logo, all built from the same system**. Each logo writes the **full product word** (Trip, Feel, Bowl, ...)
in **special, characterful lettering**, and **one letter of that word is built into a paw without losing its own shape**. The paw is
the cute glossy sticker paw we already love (`pawtrip/assets/icons/masters/logo-paw.png`). Products differ by word and by tile
color; the system (paw, lettering style, way of building the paw into a letter, layout) is identical.

Decided so far:
- **Keep the cute paw** (gold, dark-brown outline, white sticker edge, glossy highlight) — attach `masters/logo-paw.png` as the reference.
- **Full product word**, never just two letters. **One letter keeps its own shape and grows paw features** (counter or dot).
- **Special lettering**, not a plain sans-serif (the plain Nunito-like type looked too ordinary).
- **Nice background colors**: warm cream or deep cocoa. **Not gold, not orange, not saturated colors** (gold made the gold paw disappear
  and looked unattractive).
- The final artwork is redrawn by us as exact SVG with a real font that matches the chosen lettering (AI is for exploring the look).

## Lettering: make it special (what ChatGPT should do, and what we will match with a real font)

Not a generic sans-serif. The lettering should have personality and feel like it belongs to the cute paw:

- **A — "Chunky bubble"**: very bold, soft, rounded letters with quirky friendly details (a slightly bouncy baseline, letters of
  gently different heights, curvy `w`, `a`, `g`), tight spacing so the letters almost touch like soft candy. Solid dark brown `#4A3628`
  on cream, or cream `#FFF4D6` on cocoa. Real-font match: Bagel Fat One / Gluten.
- **B — "Sticker lettering"** (same language as the paw): letters filled gold `#FFC72C` with a thick dark-brown `#4A3628` outline, a small
  white glossy highlight on each letter, and a thin white sticker edge around the whole word. Looks like a sticker made of the
  same material as the paw. Real-font match: Bagel Fat One / Modak with an outline.

## How a letter becomes a paw (shape-preserving — not a paw pasted on top)

The letter keeps its own shape (stroke weight, height, width, outline) so it reads as that letter, and the paw grows out of the
letter's own structure. Pick the roundest letter (o, e, a); if the word has none, use the i.

| Letter | How the paw is built into it |
|---|---|
| **o** | Keep the round ring. The **counter (the hole) is shaped like a paw print**: one pad + four small toe beans, cut out as negative space. |
| **e** | Keep the e (bowl + crossbar). The **small hole of the e is a paw pad** with **four small toe beans** as dots around it, inside the letter's outline. |
| **a** | Keep the single-story a. The **bowl's counter is a paw pad with toe beans** as negative space. |
| **i** | Keep the stem. The **dot of the i is a small paw print** (pad + four toes) in the same weight. |

Examples: **Bowl** → o; **Feel** → one e; **Trip** → the i's dot; later **Walk / Play** → a. The paw detail is negative space or the same
flat color as the letter (no extra colors); it must read as a paw at 60 px; the word must read perfectly when the paw is ignored.

## System (identical in every product logo)

- **Paw reference**: the attached cute paw; the paw built into the letter is a simplified version of it (one pad + four toes).
- **Tile (app icon)**: the same rounded square, same corner radius; word centered, big; the full cute paw sits above the word.
- **Tile colors**: Trip = warm cream `#FFF4D6` (text dark brown) and deep cocoa `#4A3628` (text cream); Feel = soft blush `#FBD6E4`
  (text `#7A2E4E`); Bowl = soft peach `#FFD9B8` (text `#4A3628`). Soft, warm pastels or cocoa only.
- **"Paw" brand word**: the paw above the word says "Paw"; for headers/store banners also write "Paw" small before the word, same place and style.
- Legible at 60 px; the paw alone is the 16 px favicon.

## Prompt 1 — explore the look: 4 variations × 3 products (new chat; ATTACH `masters/logo-paw.png`)

```
I'm attaching the cute paw print I want to keep (gold paw, dark-brown outline, white sticker edge, glossy highlight).
Design a product logo system for a family of dog apps called "Paw ___": Paw Trip, Paw Feel, Paw Bowl.

Each logo = a rounded-square app tile + the attached cute paw above + the FULL product word below, correctly spelled:
"Trip", "Feel", "Bowl". The lettering must be SPECIAL and characterful, NOT a plain sans-serif: very bold, soft, rounded,
friendly, with quirky details (slightly bouncy baseline, letters of gently different heights, curvy w/a/g, tight candy-like
spacing). It should feel like it was made of the same material as the cute paw.

In each word, exactly ONE letter keeps its own shape and has a paw built into it (the letter must still read clearly as that
letter): in "Bowl" the o keeps its ring and its inner hole is cut out as a paw print (one pad + four tiny toe beans); in "Feel" one e
keeps its shape and its small hole is a paw pad with four tiny toe beans; in "Trip" the i keeps its stem and its dot is a small
paw print. The paw detail is negative space or the same color as the letter. Never paste a separate paw icon over a letter.

Show 4 variations, one per row, each row showing the three logos (Trip, Feel, Bowl) side by side:
Row 1: warm cream tile (#FFF4D6), "chunky bubble" lettering in solid dark brown (#4A3628).
Row 2: warm cream tile (#FFF4D6), "sticker lettering": gold (#FFC72C) letters with a thick dark-brown outline, a small white
       glossy highlight on each letter and a thin white sticker edge around the word (same look as the paw).
Row 3: deep cocoa tile (#4A3628), "chunky bubble" lettering in cream (#FFF4D6).
Row 4: deep cocoa tile (#4A3628), "sticker lettering" in gold with dark-brown outline and white edge.
For Feel use a soft blush tile (#FBD6E4) and for Bowl a soft peach tile (#FFD9B8) in rows 1 and 2 (text dark brown /
berry #7A2E4E); keep rows 3 and 4 cocoa for all three.
Do NOT use gold, orange or saturated colors as tile backgrounds. Keep the paw exactly as in the attachment.
Outside the tiles: pure white (#FFFFFF), each tile fully inside its own cell with at least 12% empty margin, nothing crossing
cells, no grid lines, no row labels, no text other than the logos' own words, no stray specks. 4 rows x 3 columns in one
square image. All words correctly spelled and readable at 60 px.
```

## Prompt 2 — refine the one you like (attach the image + `masters/logo-paw.png`; ONE image per request)

```
Take the attached logo variation in row <N>. Keep the concept, the cute paw, the colors and the lettering style EXACTLY.
Improve only: even letter spacing, identical letter size and baseline logic in all three logos, perfectly smooth shapes, the
paw built into the letter keeps exactly the letter's height, width and stroke weight (the letter stays fully readable), words
correctly spelled ("Trip", "Feel", "Bowl"). Show the three tiles side by side on pure white (#FFFFFF) with wide margins and
no stray specks. Output ONE image.
```

## Prompt 3 — does it scale? (attach the chosen logos)

```
Using exactly the same system as the attached logos (same tile, cute paw above, same special lettering, same way of building a
paw into the roundest letter's counter), add two more products: "Walk" (the a keeps its shape, its counter is a paw; soft mint tile
#D7F0DF, text #2F6B45) and "Play" (the a keeps its shape, its counter is a paw; soft sky tile #CFE8F5, text #2F5D74). Show all
five tiles side by side on pure white (#FFFFFF), no other text, no stray specks, words correctly spelled. Output ONE image.
```

## What I do afterwards

- Pick the real font that matches the chosen lettering (candidate specimens in `docs/logo-explore/font_specimen.png`; Bagel Fat One
  is the closest to "chunky bubble"), redraw the whole logo as **exact SVG** (spelling, spacing, tile, paw-in-letter), export app
  icons (1024), favicon (the paw), store assets, one-color and horizontal versions.
- A `Logo` component: `<Logo product="trip" />`; a new product = a word, a tile color, and which letter holds the paw.

## Checks before approving

1. Is the paw still cute and unchanged? Is the background pleasant (cream/cocoa/soft pastel)?
2. Does the lettering look special (not like a default font) and match the paw's material?
3. Does the letter with the paw keep its own shape, and can you read the word without noticing the paw?
4. Spelling correct, identical size/baseline across the three? At 60 px / 32 px still readable?
5. Side by side: one family, but each instantly different?

## Lessons from earlier rounds (built into the prompts)

- White surround only (no magenta, no checkerboard). Each logo fully inside its cell with wide margins.
- Don't put a small symbol (pin, compass, heart) into a paw pad. Two letters alone are not enough: write the full word.
- A plain sans-serif looked ordinary; gold/orange tile backgrounds looked unattractive and hid the gold paw.
- A pasted-on paw in place of a letter hurts readability: the letter keeps its shape and the paw lives in its counter/dot.
- Explore several variations in one image; refine ONE image at a time and edit rather than redraw. AI letters can be misspelled: always check.
