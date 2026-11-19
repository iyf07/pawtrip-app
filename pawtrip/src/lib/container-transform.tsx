import { useEffect, useState } from 'react';
import { Animated, Easing, useWindowDimensions } from 'react-native';

type Rect = { x: number; y: number; width: number; height: number; color: string; radius: number };
let listener: ((r: Rect) => void) | null = null;
let active = false;

/** True while a container transform runs: the page transition stays still so the two do not fight. */
export const isTransforming = () => active;

/**
 * Container transform: a card that is tapped grows into the next page. Pass the card's window rectangle and colour, and
 * `go` (the navigation). A coloured shape starts exactly on the card, expands to the whole window (380 ms) while the new
 * page appears under it without sliding, then fades away to reveal the page.
 */
export function runContainerTransform(rect: Rect, go: () => void) {
  if (!listener) return go();
  active = true;
  listener(rect);
  go();
}

export function ContainerTransformHost() {
  const { width, height } = useWindowDimensions();
  const [rect, setRect] = useState<Rect | null>(null);
  const [p] = useState(() => new Animated.Value(0));
  const [fade] = useState(() => new Animated.Value(1));
  useEffect(() => {
    listener = (r) => {
      p.setValue(0);
      fade.setValue(1);
      setRect(r);
      Animated.sequence([
        Animated.timing(p, { toValue: 1, duration: 380, easing: Easing.inOut(Easing.cubic), useNativeDriver: false }),
        Animated.timing(fade, { toValue: 0, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: false }),
      ]).start(() => {
        active = false;
        setRect(null);
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
