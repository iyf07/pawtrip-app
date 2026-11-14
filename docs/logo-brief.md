# Paw product logos (wordmarks) — brief for ChatGPT image generation

**No attachments; every request is a fresh generation and fully self-contained.** Copy the whole block into ChatGPT.

## Decision (latest)

The user liked the first row of the earlier wordmark exploration (`docs/logo-explore/wordmark-reference-v1.png`: the product word in
bold rounded dark-brown letters with a paw built into one letter) and asked for three changes:
1. **Pure white background** (no colored tile).
2. **The letter that holds the paw takes the product color** (the former tile color); all other letters stay dark brown.
3. **A bigger paw.**

Earlier directions (symbol-only logos with a cut-out pad, sticker-style paw above the word, two-letter logos) are replaced by this.

## The logos

| Product | Word | Letter that holds the paw | Product color (sampled from the liked image) |
|---|---|---|---|
| Paw Trip | **Trip** | the **i**: the stem plus a big paw as its dot | gold `#FEC119` |
| Paw Feel | **Feel** | one **e** (the second e): the paw sits in its eye (counter) | pink `#EB86A6` |
| Paw Bowl | **Bowl** | the **o**: the paw fills its counter | orange `#F48D4B` |

- All other letters: dark brown `#4A3628`. Background: **pure white `#FFFFFF`**. Only **two colors plus white** per logo.
- **The paw is the same drawing in all logos**: a cute chubby paw print (four plump round toe beans in a gentle arc above one soft
  rounded pad), flat, no outline, in the **product color** (same color as its letter).
- **The paw is BIG**: clearly larger than in the earlier version. In "Trip" the paw is the dot of the i and about as wide as the
  letter's stem is thick times 2 — roughly the width of the x-height of the letters (a bold, easy-to-see paw). In "Feel" and
  "Bowl" the paw fills most of the letter's counter (about 75–80% of it), leaving only a thin rim of the letter's stroke.
- The letter that holds the paw **keeps its own shape and stroke weight** so it still reads clearly as that letter.
- Lettering: one very bold, rounded geometric sans-serif (heavy weight, soft rounded terminals, generous round shapes, tight but
  even spacing). Same size and baseline in all three logos.
- Flat only: NO outlines, NO gradients, NO shadows, NO glow, NO glossy highlights, NO textures, NO sticker border, NO 3D.

## Request 1 — all three logos, two paw sizes (paste the whole block)

```
Design wordmark logos for a family of dog apps: "Trip", "Feel" and "Bowl" (the apps are called Paw Trip, Paw Feel and Paw Bowl,
but each logo shows only its one word). Make them in ONE square image on a pure white (#FFFFFF) background: 3 columns (Trip, Feel,
Bowl) x 2 rows, each logo centered in its own cell with at least 12% empty margin, nothing crossing cells, no grid lines, no
labels, no other text, no stray specks.

STYLE (identical in every logo): flat, minimal, professional. Only two colors per logo plus the white background: dark brown
#4A3628 for all letters except one, and the product color for the one letter that holds a paw. NO outlines, NO gradients, NO
shadows, NO glow, NO glossy highlights, NO textures, NO sticker border, NO 3D. The lettering is one very bold, rounded geometric
sans-serif (heavy weight, soft rounded terminals, generous round shapes, tight but even letter spacing), the same size and
baseline in all three logos, words correctly spelled.

THE PAW LETTER: in each word exactly one letter holds a BIG paw and is drawn in the product color (the other letters stay dark
brown). The paw is a cute chubby paw print: four plump round toe beans in a gentle arc above one soft rounded pad, flat, no
outline, in the product color, and it is the same paw drawing in all three logos. The letter keeps its own shape and stroke weight
so it still reads clearly as that letter; the paw is built into it, never pasted on top.
- "Trip": the "i" is in gold #FEC119: its stem is gold and the dot of the i is a big gold paw print, as wide as about twice the
  stem's thickness (clearly bigger than a normal dot).
- "Feel": the second "e" is in pink #EB86A6 and its small hole (eye) holds a big pink paw filling about 75-80% of the hole.
- "Bowl": the "o" is in orange #F48D4B and its inner hole holds a big orange paw filling about 75-80% of the hole.
The paw must stay clearly recognizable as a paw at small size.

ROWS: row 1 = the paw is big; row 2 = the paw is even bigger (about 25% larger than row 1), so I can choose. Everything else is
identical between the rows.

Also deliver EACH logo as its own separate PNG file (2048x1024, pure white background, the wordmark centered with wide margins),
named logo-trip-a.png, logo-feel-a.png, logo-bowl-a.png (row 1) and logo-trip-b.png, logo-feel-b.png, logo-bowl-b.png (row 2),
together in ONE ZIP, in addition to the comparison image. Do not ask questions; just generate.
```

## Request 2 — refine the one you chose (paste the whole block)

```
Design wordmark logos on a pure white (#FFFFFF) background, flat and minimal: NO outlines, NO gradients, NO shadows, NO glow, NO
glossy highlights, NO sticker border, NO 3D. Very bold, rounded geometric sans-serif letters in dark brown #4A3628, correctly
spelled. In each word exactly one letter is drawn in the product color and holds a BIG cute paw print (four plump round toe beans in
an arc above one soft rounded pad, flat, no outline, in the product color); the letter keeps its own shape and stroke weight, the
paw is built into it. Words: "Trip" (the i in gold #FEC119, the paw is the dot of the i), "Feel" (the second e in pink #EB86A6, the
paw fills its eye), "Bowl" (the o in orange #F48D4B, the paw fills its counter). Use the paw size of <row 1 | row 2> from my last
image. Make it cleaner and more precise: perfect smooth curves, even letter spacing, identical letter size and baseline in all
three, the paw perfectly centered in its counter / above the stem, all words correctly spelled. <optional notes, for example
"paw 10% bigger", "heavier letters">
Deliver one comparison image with the three logos side by side, and each logo as its own 2048x1024 PNG (pure white background):
logo-trip.png, logo-feel.png, logo-bowl.png, in ONE ZIP. Do not ask questions; just generate.
```

## Request 3 — the next products (same system)

```
Same system and style as the previous logos (very bold rounded dark-brown letters on pure white, one letter in the product color
holding a big flat cute paw print, no outlines, no gradients, no shadows). Make two more wordmarks: "Walk" (the "a" in green
#4CAF6A holds the paw in its counter) and "Play" (the "a" in violet #8A6BE0 holds the paw in its counter), in the same size and
baseline as before. One comparison image with all five logos (Trip, Feel, Bowl, Walk, Play) side by side, plus each new logo as its own
2048x1024 PNG named logo-walk.png and logo-play.png in ONE ZIP. Words correctly spelled. Do not ask questions; just generate.
```

## What I do afterwards

- Redraw the chosen logos as **exact SVG** with a real bold rounded font (candidates in `docs/logo-explore/font_specimen.png`; the
  look in the reference is close to Nunito Black / Baloo 2 ExtraBold), with the paw drawn once and placed exactly in the letter's
  counter or as the dot. Export app icons, favicon (the paw alone in the product color), store assets, one-color and dark versions.
- A `Logo` component: `<Logo product="trip" />` (word, color, and which letter holds the paw); a new product is a word, a color and
  a letter.
- Swap them into the left rail, mobile navbar, sign-in, splash, favicon and the app icon.

## Checks before approving

1. Is the background pure white and are there only two colors (dark brown + the product color)?
2. Is the paw clearly bigger and still clearly a paw at 32 px?
3. Does the letter with the paw keep its own shape, and can you read the word instantly?
4. Spelling correct; same size/baseline in all three?
5. Side by side: one family, each instantly different by color and letter?

## Lessons from earlier rounds

- White background only; no gold/orange or colored tiles; no gloss, outline or sticker edge (they read as AI-generated).
- A separate paw above the word felt detached: the paw lives in a letter.
- Two letters alone are not enough: write the full word.
- Paw too small: make it big (about the width of the stem x2 as the i-dot; 75-80% of the counter).
- ChatGPT can stop after the first item: list every logo and the counts, and say "do not stop, do not ask questions".
- Final letters are set by us in real type (AI can misspell).
