# Paw product logo system — brief for ChatGPT image generation

**How we use ChatGPT: no attachments, every time a fresh generation.** Each prompt below is self-contained: it starts with the same
**STYLE SPEC** (paste it at the top of every request), then adds the request.

Every product has **its own logo, built from the same system**: the **full product word** (Trip, Feel, Bowl, ...) set as a clean,
minimal wordmark, where **one letter keeps its own shape and the cute paw lives inside that letter**. There is **no separate paw
above or beside the word** — the paw is part of the lettering.

Decided so far:
- **The paw stays cute (plump round toes + soft round pad) but is merged into one letter**, not placed on its own.
- **Minimal and flat — it must not look AI-generated**: two colors, no glossy highlights, no gradients, no sticker edges, no
  outlines, no shadows, no decoration; clean geometric construction, consistent shapes, looks like a human brand designer made it.
- **Full product word**, never just two letters.
- **Pleasant backgrounds**: warm cream, deep cocoa, soft pastels. **Not gold, not orange, not saturated colors.**
- Final artwork is redrawn by us as exact SVG with a real font (candidates: `docs/logo-explore/font_specimen.png`).

## What makes a logo look "AI-generated" (and what to avoid)

Glossy highlights and gradients · white sticker edges · outlines around letters · uneven, wobbly or randomly different letters ·
over-decoration (sparkles, swirls, extra icons) · smudgy or inconsistent edges · too many colors · scenes and shadows. A good logo
is the opposite: **one idea, few shapes, precise geometry, consistent stroke weight, two colors, lots of breathing room.**

## STYLE SPEC — paste this at the top of EVERY request

```
STYLE SPEC for a family of dog apps called "Paw ___" (Paw Trip, Paw Feel, Paw Bowl).

OVERALL LOOK: a minimal, flat, professional brand wordmark, like one designed by a human brand designer. ONE idea only: the full
product word, with a cute paw print built into one of its letters. Only TWO colors per logo (letters + paw accent) on a flat
background. NO outlines, NO strokes around letters, NO glossy highlights, NO gradients, NO shadows, NO glow, NO white sticker
edge, NO 3D, NO textures, NO sparkles or extra decoration, NO separate paw icon above or next to the word. Clean geometry,
consistent stroke weight, perfectly even letter shapes, generous space around the word. It must NOT look AI-generated.

THE LETTERING: one bold, rounded, friendly geometric typeface with a distinctive character (soft rounded terminals, slightly
generous round shapes, tight but even spacing) — not a default font, not wobbly, no random quirks. Every letter built with the
same stroke weight and the same rounded corners. Letters are dark brown #4A3628 on light backgrounds and cream #FFF4D6 on dark
backgrounds.

THE PAW INSIDE ONE LETTER: exactly ONE letter of each word keeps its own recognizable shape (same height, width and stroke
weight as its neighbours) and the cute paw is built into it, so the paw and the letter are one shape. The paw is cute: four plump
round toe beans and one soft rounded pad, simple flat shapes, filled with gold #FFC72C (the only accent color).
  "o": the round ring stays dark brown; its inner hole holds the gold paw (soft pad + four small round toe beans).
  "e": the e stays dark brown (bowl + crossbar); the small hole of the e holds a gold paw pad with four tiny round toe beans.
  "a": the single-story a stays; the hole of its bowl holds the gold paw.
  "i": the stem stays dark brown; the dot of the i is a small gold paw (pad + four toes).
Never paste a separate paw icon over a letter. The word must read perfectly at a glance, with the paw as a delightful detail.

BACKGROUND / TILE: a flat background in a pleasant soft color: warm cream #FFF4D6, deep cocoa #4A3628, soft blush #FBD6E4, soft
peach #FFD9B8, soft mint #D7F0DF or soft sky #CFE8F5. NEVER gold, orange or saturated colors. The app-icon version is a rounded
square of that color with the wordmark centered.

OUTPUT RULES: crisp vector-like edges, words correctly spelled, no text other than the logo's own words. Outside the logos:
pure white (#FFFFFF); each logo fully inside its own cell with at least 12% empty margin, nothing crossing cells, no grid lines,
no labels, no stray specks. Each logo must stay readable at 60 px.
```

## Request 1 — explore the look (spec + this)

```
[paste the STYLE SPEC above]

REQUEST: Wordmarks for "Trip", "Feel" and "Bowl". Make ONE square image with 4 rows x 3 columns; each row shows the three
logos (Trip, Feel, Bowl) side by side:
Row 1: wordmark only, dark brown letters + gold paw on a warm cream background (no tile, no rounded square).
Row 2: the same wordmark inside a rounded-square tile, warm cream tile.
Row 3: the same wordmark inside a rounded-square tile, deep cocoa tile, cream letters + gold paw.
Row 4: wordmark only on warm cream, but in a different typeface character: rounder and slightly heavier, softer corners.
Paw in the letter: Trip = the dot of the i; Feel = the second e; Bowl = the o.
For Feel use a soft blush tile and for Bowl a soft peach tile in row 2 (text dark brown, paw gold); keep row 3 cocoa for all.
```

## Request 2 — regenerate the one you liked, cleaner (spec + this; nothing attached)

```
[paste the STYLE SPEC above]

REQUEST: Generate only the style of "row <N>" for Trip, Feel and Bowl side by side in ONE image on pure white, large, with wide
margins. Make it cleaner and more precise: even letter spacing, identical letter size and baseline in all three, perfectly smooth
geometry, the letter that holds the paw keeps exactly its height, width and stroke weight, the paw is cute and perfectly
centered in the counter / dot, all words correctly spelled ("Trip", "Feel", "Bowl").
<optional notes, e.g. "paw 15% bigger", "heavier letters", "less rounded">
```

## Request 3 — more products, same system (spec + this)

```
[paste the STYLE SPEC above]

REQUEST: Same system and style as "row <N>". Show five logos in one image: "Trip", "Feel", "Bowl", "Walk" (the a holds the paw)
and "Play" (the a holds the paw), identical typeface, sizes and paw drawing in all five. Words correctly spelled.
```

Tip: with no attachments, results can drift between requests. Stay in the **same chat** and say "same as the previous image, but ...".
If the look gets busy (highlights, outlines creep in), paste the OVERALL LOOK paragraph again.

## What I do afterwards

- Pick the real font closest to the chosen lettering (candidates in `docs/logo-explore/font_specimen.png`; for a geometric rounded
  bold: Fredoka / Baloo 2 / Nunito Black; for more character: Bagel Fat One), redraw the whole logo as **exact SVG**: perfect spelling
  and spacing, the one letter modified so the paw sits exactly in its counter/dot. Export app icons (1024), favicon (the paw-letter
  alone), store assets, one-color and horizontal versions.
- A `Logo` component: `<Logo product="trip" />`; a new product = a word, a background color, and which letter holds the paw.

## Checks before approving

1. Is the paw cute and clearly merged into a letter (not floating, not separate)?
2. Does it look designed, not AI-generated: flat, two colors, no gloss/outline/sticker edge, even geometry?
3. Does the letter with the paw keep its own shape, and can you read the word instantly?
4. Spelling correct, identical size/baseline across the three? Readable at 60 px and 32 px?
5. Side by side: one family, each instantly different?

## Lessons from earlier rounds (built into the spec)

- White surround only (no magenta, no checkerboard). Each logo fully inside its cell with wide margins.
- Don't put a small symbol (pin, compass, heart) into a paw pad. Two letters alone are not enough: write the full word.
- A plain default-looking sans-serif looked ordinary; gold/orange backgrounds looked unattractive.
- A separate paw above the word felt detached; the glossy sticker look (highlights, white edge, outlines) read as AI-generated.
  Now: flat, two colors, paw merged into one letter.
- No attachments: every prompt carries the full spec. AI letters can be misspelled: always check.
