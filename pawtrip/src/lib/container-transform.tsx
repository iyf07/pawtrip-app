import { useEffect, useState } from 'react';
import { Animated, Easing, useWindowDimensions } from 'react-native';

type Rect = { x: number; y: number; width: number; height: number; color: string; radius: number };
let listener: ((r: Rect, go: () => void) => void) | null = null;
let active = false;
let target: { x: number; y: number; width: number; height: number } | null = null;

/** True while a container transform runs: the page transition stays still so the two do not fight. */
export const isTransforming = () => active;

/** The page we are going to reports where the block that matches the shape sits, so the shape can settle onto it. */
export function setContainerTransformTarget(r: { x: number; y: number; width: number; height: number }) {
  if (active) target = r;
}

/**
 * Container transform: a card that is tapped grows into the next page. Pass the card's window rectangle and colour, and
 * `go` (the navigation). A coloured shape starts exactly on the card and expands to the whole window (420 ms) on its own,
 * with nothing else happening (mounting the next page at the same moment starved the animation of frames, and it jumped to
 * its end). Only then `go` runs, the page mounts behind the shape, and the shape fades away to reveal it.
 */
export function runContainerTransform(rect: Rect, go: () => void) {
  if (!listener) return go();
  if (active) return; // a second tap while one transform runs
  active = true;
  target = null;
  // the navigation must happen exactly once, even if the animation never finishes (frames starved, page hidden)
  let gone = false;
  const once = () => {
    if (gone) return;
    gone = true;
    go();
  };
  setTimeout(once, 900);
  setTimeout(() => { active = false; }, 4000);
  listener(rect, once);
}

export function ContainerTransformHost() {
  const { width, height } = useWindowDimensions();
  const [rect, setRect] = useState<Rect | null>(null);
  const [settle, setSettle] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [p] = useState(() => new Animated.Value(0));
  const [q] = useState(() => new Animated.Value(0));
  const [fade] = useState(() => new Animated.Value(1));
  useEffect(() => {
    const end = () => {
      active = false;
      setSettle(null);
      setRect(null);
    };
    // the page behind is in place: shrink onto its matching block (same colour), or just fade if it never reports one
    const finish = (tries: number) => {
      if (target) {
        q.setValue(0);
        setSettle(target);
        Animated.timing(q, { toValue: 1, duration: 400, easing: Easing.inOut(Easing.cubic), useNativeDriver: false }).start(() => {
          Animated.timing(fade, { toValue: 0, duration: 140, easing: Easing.out(Easing.quad), useNativeDriver: false }).start(end);
        });
      } else if (tries < 14) {
        setTimeout(() => finish(tries + 1), 40);
      } else {
        Animated.timing(fade, { toValue: 0, duration: 240, easing: Easing.out(Easing.quad), useNativeDriver: false }).start(end);
      }
    };
    listener = (r, go) => {
      p.setValue(0);
      fade.setValue(1);
      setSettle(null);
      setRect(r);
      Animated.timing(p, { toValue: 1, duration: 420, easing: Easing.inOut(Easing.cubic), useNativeDriver: false }).start(() => {
        go();
        setTimeout(() => finish(0), 120); // the page mounts behind the shape first
      });
    };
    return () => { listener = null; };
  }, [p, q, fade]);
  if (!rect) return null;
  const grow = (a: number, b: number) => p.interpolate({ inputRange: [0, 1], outputRange: [a, b] });
  const shrink = (a: number, b: number) => q.interpolate({ inputRange: [0, 1], outputRange: [a, b] });
  const style = settle
    ? { left: shrink(0, settle.x), top: shrink(0, settle.y), width: shrink(width, settle.width), height: shrink(height, settle.height), borderRadius: shrink(0, rect.radius) }
    : { left: grow(rect.x, 0), top: grow(rect.y, 0), width: grow(rect.width, width), height: grow(rect.height, height), borderRadius: grow(rect.radius, 0) };
  return <Animated.View pointerEvents="none" style={[{ position: 'absolute', zIndex: 1000, backgroundColor: rect.color, opacity: fade }, style]} />;
}
