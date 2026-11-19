export type Rect = { x: number; y: number; w: number; h: number };

/** Where the card grows to (the content area, never over the nav bar / rail) and the title that carries over. */
export type ExpandOptions = { target: Rect; label?: string; labelTop?: number; ink?: string; shadow?: string };

type Run = (from: Rect, color: string, radius: number, go: () => void, opts: ExpandOptions) => void;
let run: Run | null = null;
let fresh = false;

/** The overlay registers itself here (see `components/ExpandOverlay.tsx`). */
export function registerExpand(fn: Run | null) {
  run = fn;
}

/**
 * Open a page by growing the tapped card over the content area: the card's colour expands from its rectangle, its
 * small label turns into the page title, the page opens underneath (its header carries the same colour) and the
 * overlay fades. Falls back to a plain `go()`.
 */
export function expandThen(from: Rect | null, color: string, radius: number, go: () => void, opts?: ExpandOptions) {
  if (!run || !from || !opts) return go();
  fresh = true;
  run(from, color, radius, go, opts);
}

/** True once after an expand navigation: the new page then skips its own slide-in. */
export function consumeExpand() {
  const v = fresh;
  fresh = false;
  return v;
}
