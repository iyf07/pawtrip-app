# Paw series logo brief (for ChatGPT image generation)

One logo family for every "Paw ___" product: **Paw Travel** (this app), later **Paw Feel**, **Paw Walk**, ...
The **mark is identical** across products; each product gets its **own main color** and its **own word** under the mark.

Decided: paw print with a small detail · stacked layout (mark on top, text below) · same mark, one main color per
product · rounded bold lettering. Same sticker look as the icon set (`docs/icon-style-brief.md`).

## The mark

- A friendly **paw print**: four rounded toe beans + one large main pad, slightly chubby, soft and symmetric.
- **Small detail (series-wide, product-neutral):** the main pad has a tiny **heart-shaped cut-out / highlight** in white
  (dogs + love — it fits Travel, Feel and Walk alike). Nothing else: no compass, no pin, no text inside.
  (Product-specific details like a pin for Travel are NOT in the mark; they belong to the product word.)
- Style: cute die-cut sticker — thick even dark-brown outline `#4A3628`, flat fill in the product color, one small white
  highlight on the top-left of the pad, a thick crisp white sticker border around the whole silhouette. No gradient, no
  texture, no shadow, no glow.
- Must stay readable at 24–32 px (rail, favicon) and look good at 1024 px (app icon).

## Product colors (main fill of the paw; outline and white border never change)

| Product | Main color | Hex |
|---|---|---|
| Paw Travel | gold | `#FFC72C` |
| Paw Feel | pink | `#E68AB3` |
| Paw Walk | green | `#6CC48A` |
| Paw Play (spare) | blue | `#7DB6D0` |
| Paw Eat (spare) | orange | `#F0904E` |

Shade for the toe beans: slightly darker tone of the same color (about 10–15% darker). The heart is always white.

## Lettering

- Two lines under the mark, centered: **`Paw`** (large) and the product word (**`Travel`**, smaller, in the product color).
- Rounded bold sans-serif (like Nunito ExtraBold / Baloo / Fredoka Bold), dark brown `#4A3628` for "Paw".
- **Recommended:** generate the **mark only** with ChatGPT, and let us set the lettering as real type (Nunito ExtraBold,
  already used in the app). AI-drawn letters are often misspelled or uneven, and real type lets us add Feel / Walk
  later with exactly the same look. Ask ChatGPT for one lettering mock-up only as a visual reference.

## Files we need (name → use)

| File | What |
|---|---|
| `mark-travel.png` | paw mark, gold, flat magenta background (we cut it out) |
| `mark-feel.png`, `mark-walk.png` | the same mark recolored (pink, green) — to prove the family works |
| `lockup-travel-reference.png` | mark + "Paw Travel" stacked, only as a reference for spacing |
| `app-icon-travel.png` | 1024×1024 app icon: the mark centered on a warm rounded-square background |

## Prompt 1 — the mark (new chat; attach the 8 approved icons for style)

```
Design the main logo mark for a family of dog apps called "Paw ___" (Paw Travel, Paw Feel, Paw Walk).
The mark is a friendly paw print: four rounded toe beans and one large main pad, slightly chubby, soft, symmetric,
all the same style. The main pad has a small heart-shaped cut-out in white (a tiny heart, simple, centered). No other
details: no text, no compass, no pin.
Style: cute die-cut sticker, matching the attached approved icons exactly: thick even dark-brown outline (#4A3628)
with rounded corners, flat gold fill (#FFC72C) with the toe beans in a slightly darker gold, one small white
highlight on the top-left, a thick crisp white sticker border around the whole shape. No gradients, no textures, no
drop shadow, no glow. Must stay readable at 24 px.
Background: one perfectly flat solid magenta (#FF00FF) edge to edge, no checkerboard, no noise, no shadow;
magenta must not appear in the mark. Square 1:1, the paw fills about 70% of the canvas, centered.
Give me 4 variations of the mark (a 2x2 grid with wide magenta gaps) that differ only in the shape of the toe beans
and the heart size, so I can pick one.
```

## Prompt 2 — the family (after you pick one mark; attach it)

```
Use the attached approved paw logo mark EXACTLY (same shape, outline, white sticker border, heart, highlight).
Recolor only the main fill (keep outline, white border, heart and highlight unchanged; toe beans a slightly darker
tone of the same color) and give me 3 versions in a 3x1 grid, wide magenta gaps between them, flat magenta
background (#FF00FF), no shadow:
1) pink #E68AB3  2) green #6CC48A  3) blue #7DB6D0
```

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

- Shrink to 24 px: still a paw with a visible heart?
- Put it next to the 8 existing icons on cream `#FCF8F0`: same outline weight and white border?
- Recolor test: does pink / green still look like the same family?

## What I do afterwards

1. Cut out the magenta, export 1024 / 512 / 256 / 64 / 32 px.
2. Make the mark the app logo everywhere (rail, mobile navbar, sign-in, favicon, splash, `app.json` icons).
3. Set the lettering in Nunito ExtraBold with a `Logo` component: `<Logo product="travel" />` → mark in the product
   color + "Paw" + "Travel"; other products only change the word and color.
