# PawTrip mascot (dog) — brief for ChatGPT

**Status: TODO.** The user is making ("捏") a physical dog mascot and will give ChatGPT **photos of it**. ChatGPT turns the photos into a flat, calm, premium-but-cute character that matches `docs/icon-redesign-v2.md`. The mascot then appears in empty states, loading, success moments, onboarding, the logo and the dog icons, so it is the brand's face.

## What the user will provide
- 4–6 photos of the finished mascot on a plain background, same lighting: front, 3/4 left, 3/4 right, side, back, close-up of the face. Plus one photo showing the true colours.
- Notes: the name (TBD), personality in 3 words (TBD), anything that must not change (markings, ear shape, nose colour, tail).

## How ChatGPT must treat the photos
- **Use the shape language, not the material**: keep proportions, ear shape, face layout, markings and colours of the real mascot; do NOT copy clay/plush texture, wrinkles, fingerprints, shadows or the photo background. The result is flat colour (≤ 2 tones + 1 accent), thin soft outline `#6B4F3A`, chubby rounded forms, tiny details only (dot eyes, small nose, a blush dot).
- **Lock the identity** once approved: write down the "character lock" (colour hex values, marking positions, ear/tail shape, eye spacing, nose shape) and paste it at the top of every later prompt together with the approved character sheet image.
- Same optical style as the icon set: no gloss, no gradients, no white sticker border, no drop shadow, pure white `#FFFFFF` background so our script can cut it out.

## Steps (do not skip the approval gates)
1. **Character sheet** (one image): front, 3/4, side, back, plus 6 expressions (neutral, happy, sleepy, curious, sad, excited) on white. User approves or asks for fixes; save as `docs/mascot/character-sheet.png` and record the **character lock** text in this file.
2. **Pose batches** (attach the approved sheet each time), files named `mascot-<name>.png`, 1024 px master + 512 px UI file in `assets/mascot/` (same cleaning script as icons):
   - Empty states (priority): `mascot-empty-trips` (waiting with a tiny suitcase), `mascot-empty-friends` (waving), `mascot-empty-dogs`, `mascot-empty-notifications` (asleep / ✓), `mascot-empty-offline` (holding a tangled cable), `mascot-empty-search` (magnifier), `mascot-empty-day` (looking at a blank map).
   - Moments: `mascot-success` (tail wag + paw up), `mascot-loading` (running / digging), `mascot-error` (head tilt), `mascot-celebrate` (confetti-free: just happy hop), `mascot-sleep`.
   - Onboarding: `mascot-hello`, `mascot-packing`, `mascot-ready`.
   - Brand: `mascot-logo` (face only, works at 32 px) → replaces / refines `logo-paw` and the wordmark paw.
3. **Dog icons follow the mascot**: `nav-dogs`, `dog-*`, `mood-*`, `empty-*`, `ui-dog-warning` and the dog sticker placeholders are redrawn from the approved face (see icon brief tier B).

## Prompt template (paste after attaching the photos)

```
You are the character designer for PawTrip, a dog-friendly group trip planner. I attach photos of a real handmade dog mascot.
Turn it into a flat, calm, "premium but still cute" 2D character that keeps the mascot's proportions, ear shape, face layout,
markings and colours, but NOT its material (no texture, wrinkles, photo shadows or background).
Style: flat colour, at most two fill tones plus one small accent, a thin even soft outline #6B4F3A (about 2.5% of the width),
chubby rounded forms, only tiny friendly details (dot eyes, a small nose, a blush dot). No gloss, no gradients, no 3D, no white
sticker border, no drop shadow. Pure flat white #FFFFFF background, edge to edge, nothing else on it.
Deliver a CHARACTER SHEET: front, 3/4 view, side, back, and six expressions (neutral, happy, sleepy, curious, sad, excited),
each in its own cell with 15% empty margin; no grid lines, labels or numbers.
Then write a "character lock": the exact hex colours, where each marking is, ear shape, tail shape, eye spacing, nose shape,
so every future image matches.
```

## Where the mascot is used (so poses match real screens)
Empty states of trips / friends / dogs / notifications / calendar / map, loading and pull-to-refresh, save-success toast,
onboarding and sign-in, the circle's dog placeholder (photo-less dogs), the app logo, 404/offline pages.
Cute is carried by this character and a few small moments, not by decoration everywhere (see the handoff: premium restraint).
