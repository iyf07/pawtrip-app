export type Rect = { x: number; y: number; w: number; h: number };

let run: ((from: Rect, color: string, radius: number, go: () => void) => void) | null = null;
let fresh = false;

/** The overlay registers itself here (see `components/ExpandOverlay.tsx`). */
export function registerExpand(fn: typeof run) {
  run = fn;
}

/**
 * Open a page by growing the tapped card to full screen: the card's colour expands from its rectangle to the whole
 * window, the page is opened underneath, then the colour fades away. Falls back to a plain `go()`.
 */
export function expandThen(from: Rect | null, color: string, radius: number, go: () => void) {
  if (!run || !from) return go();
  fresh = true;
  run(from, color, radius, go);
}

/** True once after an expand navigation: the new page then skips its own slide-in. */
export function consumeExpand() {
  const v = fresh;
  fresh = false;
  return v;
}
