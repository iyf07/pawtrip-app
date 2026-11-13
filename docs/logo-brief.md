# Paw brand logo brief (for ChatGPT image generation)

**One standalone brand mark** for every "Paw ___" product (Paw Travel now; Paw Feel, Paw Walk, ... later). It is NOT part of
the in-app sticker icon set and does not copy its style. The same mark is used on every app, the website and the app stores.
Products are told apart by the **word** next to the mark (and an optional accent color for that word), not by a different mark.

Decided: **flat, modern, minimal brand mark · a distinctive paw print · gold + dark brown · mark only; "Paw" and the product
name are set in real type by us (not drawn by AI).**

## What the mark is

- A **paw print** with real design: simple geometric shapes (perfect circles / rounded pills / one soft rounded pad), balanced
  and slightly dynamic. It should look like something a design studio drew, not a clip-art paw and not a cute sticker.
- **Flat**: solid color shapes only. **No outlines, no strokes, no gradients, no shadows, no glow, no highlights, no 3D,
  no sticker border, no texture.**
- **Two colors maximum**: gold `#FFC72C` and dark brown `#4A3628` (white/cream only as negative space). One-color
  versions (all brown, all white) must also work.
- **No text, no extra symbols** inside or around the paw (no heart, pin, compass, letters). Distinctiveness comes from
  the *shape language* only (toe proportions, the pad's silhouette, the spacing / negative space).
- Must read at **16 px** (favicon) and look great at 1024 px (app icon), on light, cream, dark and gold backgrounds.
- Avoid shapes that read as something else (butt, mustache, flower, bear). Keep the pad a soft rounded triangle / bean,
  with clearly separated toes.

## Lessons from earlier rounds (already built into the prompts)

- White background only (we cut the mark out ourselves). No magenta, no checkerboard, no "transparent" claims.
- Several concepts in one image are fine for exploring, but each concept must sit fully inside its own cell with wide
  margins, nothing crossing cells, no stray specks.
- Don't put a small symbol into the pad (looked wrong). Don't redraw an approved shape when refining — edit it.

## Prompt 1 — explore: 6 different concepts (new chat, no attachments)

```
Design a brand logo mark for a family of dog apps called "Paw ___" (Paw Travel, Paw Feel, Paw Walk).
The mark is a distinctive paw print, designed like a professional brand identity: flat, modern, minimal, balanced,
made of simple geometric shapes (circles, rounded pills, one soft rounded pad). It must NOT look like clip art, a cute
sticker, or a cartoon.
Rules: flat solid shapes only; NO outlines, NO strokes, NO gradients, NO shadows, NO glow, NO highlights, NO 3D,
NO texture. Only two colors: gold #FFC72C and dark brown #4A3628 (plus white background). No text, no letters, no
extra symbols (no heart, pin, compass).
Give me 6 clearly DIFFERENT concepts in a 3x2 grid on a pure white (#FFFFFF) background, each fully inside its own
cell with at least 20% empty margin on all sides, nothing crossing cells, no grid lines, no labels, no stray specks.
Vary: the toe shapes and arrangement (circles vs pills vs teardrops, fan vs arc), the pad silhouette (rounded triangle,
bean, soft square), the spacing / negative space, and whether the paw is gold with brown toes, all gold, or all brown.
Each must stay readable at 16 px. Square image.
```

## Prompt 2 — refine the one you like (attach the chosen concept; ONE image per request)

```
Edit the attached logo mark. Keep its concept, shape language, colors and proportions EXACTLY. Only improve:
perfectly symmetric/balanced geometry, equal spacing between the toes and the pad, clean smooth curves, optical
balance of the toe sizes. No outlines, no gradients, no shadows, no highlights, no text, no extra symbols.
Flat, two colors (gold #FFC72C, dark brown #4A3628) on a pure white (#FFFFFF) background, mark centered, filling
about 70% of the square image, wide empty margin, no stray specks. Output ONE image.
```

## Prompt 3 — the versions we need (attach the final mark; ONE image per request)

```
Use the attached logo mark EXACTLY (same shapes and proportions). Make: <version>.
Flat, no outlines, no gradients, no shadows, no highlights, no text. Pure white (#FFFFFF) background unless the
version says otherwise. Mark centered, wide margins, square image. Output ONE image.
```

Versions: (a) all dark brown `#4A3628`; (b) all white on a solid dark-brown `#4A3628` square; (c) dark brown mark on a solid
gold `#FFC72C` square (app icon style: mark about 55% of the square, rounded corners are applied by the app store);
(d) all gold `#FFC72C`.

## What I do (so you don't need AI for the final files)

AI images are bitmaps with soft edges. Once you pick the concept, **I redraw it as an exact vector (SVG)** with perfect
geometry, then export every size and color version (favicon 16/32, app icons 1024, store assets, one-color versions).
You only need to pick the concept; ChatGPT is for exploring and choosing.

## Lettering (set by us, not drawn by AI)

- "Paw" in **Nunito ExtraBold** (already in the app), dark brown `#4A3628`; the product word ("Travel", "Feel", "Walk") in the same
  font, lighter weight or the product's accent color: Travel gold-brown, Feel pink `#E68AB3`, Walk green `#6CC48A`.
- Layouts: stacked (mark on top, text below) for app icons / sign-in / splash; horizontal (mark, then text) for headers.
- A `Logo` component: `<Logo product="travel" layout="stacked" />`; new products only add a word and a color.

## Checks before approving a concept

1. Shrink to 16 px: still clearly a paw?
2. One color (all brown / all white): still works?
3. On cream `#FCF8F0`, dark `#231B15` and gold `#FFC72C` backgrounds: still readable and balanced?
4. Does it look like a brand (calm, confident, geometric), not like a sticker or emoji?
5. Does any part read as something else?

## Where it goes afterwards

App icon (iOS/Android), splash screen, favicon, sign-in page, left rail logo, mobile navbar, app store listing, website.
