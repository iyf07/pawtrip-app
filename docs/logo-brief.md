# Paw series logo brief (for ChatGPT image generation)

One logo family for every "Paw ___" product: **Paw Travel** (this app), later **Paw Feel**, **Paw Walk**, ...
Every logo is the **same paw print** with **its own emblem inside the main pad** and **its own main color**, plus its
own word under it. The shared paw makes them a family; the emblem + color make each product recognizable at a glance.

Decided: paw print + a product emblem · stacked layout (mark on top, text below) · one main color per product ·
rounded bold lettering. Same sticker look as the icon set (`docs/icon-style-brief.md`).

## The shared paw (identical in every product)

- A friendly **paw print**: four rounded toe beans + one large main pad, slightly chubby, soft and symmetric.
  The exact shape, proportions, outline weight, white sticker border and highlight never change between products.
- Style: cute die-cut sticker — thick even dark-brown outline `#4A3628`, flat fill in the product color, toe beans a
  slightly darker tone, one small white highlight on the top-left of the pad, a thick crisp white sticker border around
  the whole silhouette. No gradient, no texture, no shadow, no glow.
- Must stay readable at 24–32 px (rail, favicon) and look good at 1024 px (app icon).

## The product emblem (the only thing that changes inside the paw)

A simple solid **dark-brown (#4A3628)** emblem silhouette sits in the middle of the main pad (stamped on, no outline),
about 55% of the pad's width. One simple shape, no text, no tiny details.

| Product | Emblem | Idea |
|---|---|---|
| Paw Travel | map pin (teardrop with a dot) | places & trips |
| Paw Feel | heart | how your dog feels / care |
| Paw Walk | leash loop (a rounded loop with a small handle) | walks |
| Paw Play (spare) | ball | play |
| Paw Eat (spare) | bone | food |

The emblem must be recognizable at 24 px. If one is not, we simplify it before using it.

## Product colors (main fill of the paw; outline and white border never change)

| Product | Main color | Hex |
|---|---|---|
| Paw Travel | gold | `#FFC72C` |
| Paw Feel | pink | `#E68AB3` |
| Paw Walk | green | `#6CC48A` |
| Paw Play (spare) | blue | `#7DB6D0` |
| Paw Eat (spare) | orange | `#F0904E` |

Shade for the toe beans: slightly darker tone of the same color (about 10–15% darker). The emblem is always dark brown.

## Lettering

- Two lines under the mark, centered: **`Paw`** (large) and the product word (**`Travel`**, smaller, in the product color).
- Rounded bold sans-serif (like Nunito ExtraBold / Baloo / Fredoka Bold), dark brown `#4A3628` for "Paw".
- **Recommended:** generate the **mark only** with ChatGPT, and let us set the lettering as real type (Nunito ExtraBold,
  already used in the app). AI-drawn letters are often misspelled or uneven, and real type lets us add Feel / Walk
  later with exactly the same look. Ask ChatGPT for one lettering mock-up only as a visual reference.

## Files we need (name → use)

| File | What |
|---|---|
| `mark-travel.png` | paw + map pin, gold, flat magenta background (we cut it out) |
| `mark-feel.png`, `mark-walk.png` | same paw + heart (pink) and + leash loop (green) — proves the family works |
| `lockup-travel-reference.png` | mark + "Paw Travel" stacked, only as a reference for spacing |
| `app-icon-travel.png` | 1024×1024 app icon: the mark centered on a warm rounded-square background |

## Prompt 1 — the Paw Travel mark: EDIT the approved paw, don't redraw it

Why: asking ChatGPT to design the paw from scratch changes the paw's proportions and makes the emblem tiny. Start from
the approved paw (`pawtrip/assets/icons/logo-paw.png`), attach it, and only add the emblem. Ask for ONE image at a
time (several variations also change the paw). The emblem is a **solid dark-brown silhouette** (no outline) so it reads
well small. Try the three placements and pick the best one.

**A — pin stamped on the main pad (safest)**

```
Edit the attached image. Keep the paw print EXACTLY as it is: same shape, proportions, colors, outline, white
sticker border and highlight. Do not redraw or restyle it. Only add one thing: a solid dark-brown (#4A3628) map-pin
silhouette (a teardrop pin with a small round hole), centered on the big main pad, about 55% of the pad's width,
flat, no outline, as if stamped onto the pad. Move the existing white highlight so it still sits on the top-left
of the pad. Background: one perfectly flat solid magenta (#FF00FF), no checkerboard, no noise, no shadow.
Square 1:1, same size and position as the original. Output ONE image.
```

**B — the main pad itself becomes the pin (most "logo-like")**

```
Edit the attached image. Keep the four toe beans, the outline, the colors, the white sticker border and the style
EXACTLY. Change only the big main pad: reshape it into a rounded map-pin (teardrop pointing down) with a small
round hole in the middle, same size and same outline weight, same highlight. Flat solid magenta (#FF00FF)
background, no checkerboard, no noise, no shadow. Square 1:1. Output ONE image.
```

**C — small badge sticker at the bottom-right (hardest to read when small)**

```
Edit the attached image. Keep the paw print EXACTLY as it is. Add a small round white sticker badge overlapping
the bottom-right of the paw, about 30% of the paw's width, with a thick white border and a thin dark-brown
outline, containing a simple solid dark-brown map pin. Flat solid magenta (#FF00FF) background, no checkerboard,
no noise, no shadow. Square 1:1. Output ONE image.
```

## Prompt 2 — the family (after you pick the Travel version; attach it)

One image per request:

```
Edit the attached image. Keep everything EXACTLY the same (paw shape, outline, white sticker border, highlight,
the way the emblem is placed). Change only: (a) the paw's main color to pink #E68AB3 (toe beans slightly darker),
and (b) the dark-brown emblem to a simple heart. Flat solid magenta (#FF00FF) background, no checkerboard, no
noise, no shadow. Square 1:1. Output ONE image.
```

Then the same with: green `#6CC48A` + a simple leash loop (Paw Walk), blue `#7DB6D0` + a simple ball (Paw Play).

## Prompt 3 — lockup reference and app icon

```
Attach the approved gold mark. Make two images, both with the mark unchanged:
A) A stacked logo: the mark on top; below it, centered, the word "Paw" in large rounded bold dark-brown (#4A3628)
   letters, and under it the word "Travel" in smaller rounded bold gold-brown letters. Same sticker style: letters
   with a thin white outline. Flat magenta background, wide padding.
B) An app icon, 1024x1024: the mark centered (about 60% of the canvas) on a warm cream (#FCF8F0) rounded-square
   background with a thin dark-brown border, no text, no shadow.
```

## Checks before approving

- Shrink to 24 px: still a paw with a clearly visible emblem?
- Put it next to the 8 existing icons on cream `#FCF8F0`: same outline weight and white border?
- Family test: put the 3–4 versions side by side — same paw, but each one instantly different (color + emblem)?

## What I do afterwards

1. Cut out the magenta, export 1024 / 512 / 256 / 64 / 32 px.
2. Make the mark the app logo everywhere (rail, mobile navbar, sign-in, favicon, splash, `app.json` icons).
3. Set the lettering in Nunito ExtraBold with a `Logo` component: `<Logo product="travel" />` → that product's mark
   (paw + its emblem, its color) + "Paw" + "Travel"; other products only add their own mark file and word.
