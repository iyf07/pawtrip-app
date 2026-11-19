import { useEffect, useState } from 'react';
import { Animated, Easing, useWindowDimensions } from 'react-native';

type Rect = { x: number; y: number; width: number; height: number; color: string; radius: number };
let listener: ((r: Rect, go: () => void) => void) | null = null;
let active = false;

/** True while a container transform runs: the page transition stays still so the two do not fight. */
export const isTransforming = () => active;

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
  // the navigation must happen exactly once, even if the animation never finishes (frames starved, page hidden)
  let gone = false;
  const once = () => {
    if (gone) return;
    gone = true;
    go();
  };
  setTimeout(once, 900);
  setTimeout(() => { active = false; }, 3000);
  listener(rect, once);
}

export function ContainerTransformHost() {
  const { width, height } = useWindowDimensions();
  const [rect, setRect] = useState<Rect | null>(null);
  const [p] = useState(() => new Animated.Value(0));
  const [fade] = useState(() => new Animated.Value(1));
  useEffect(() => {
    listener = (r, go) => {
      p.setValue(0);
      fade.setValue(1);
      setRect(r);
      Animated.timing(p, { toValue: 1, duration: 420, easing: Easing.inOut(Easing.cubic), useNativeDriver: false }).start(() => {
        go();
        setTimeout(() => {
          Animated.timing(fade, { toValue: 0, duration: 240, easing: Easing.out(Easing.quad), useNativeDriver: false }).start(() => {
            active = false;
            setRect(null);
          });
        }, 160); // the page mounts behind the shape first
      });
    };
    return () => { listener = null; };
  }, [p, fade]);
  if (!rect) return null;
  const to = (a: number, b: number) => p.interpolate({ inputRange: [0, 1], outputRange: [a, b] });
  return (
    <Animated.View
      pointerEvents="none"
      style={{ position: 'absolute', zIndex: 1000, left: to(rect.x, 0), top: to(rect.y, 0), width: to(rect.width, width), height: to(rect.height, height), borderRadius: to(rect.radius, 0), backgroundColor: rect.color, opacity: fade }}
    />
  );
}
