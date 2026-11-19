import { useEffect, useState } from 'react';
import { Animated, Easing, Platform, useWindowDimensions } from 'react-native';

import { registerExpand, type Rect } from '@/lib/expand';

const GROW_MS = 380;
const HOLD_MS = 160; // the new page renders underneath
const FADE_MS = 260;

/** Sits above the whole app. Grows a coloured rectangle from a card to the full window, then fades out. */
export function ExpandOverlay() {
  const { width, height } = useWindowDimensions();
  const [state, setState] = useState<{ from: Rect; color: string; radius: number } | null>(null);
  const [p] = useState(() => new Animated.Value(0)); // 0 = the card, 1 = full screen
  const [fade] = useState(() => new Animated.Value(1));
  useEffect(() => {
    registerExpand((from, color, radius, go) => {
      setState({ from, color, radius });
      p.setValue(0);
      fade.setValue(1);
      Animated.timing(p, { toValue: 1, duration: GROW_MS, easing: Easing.inOut(Easing.cubic), useNativeDriver: false }).start(() => {
        go();
        setTimeout(() => {
          Animated.timing(fade, { toValue: 0, duration: FADE_MS, useNativeDriver: false }).start(() => setState(null));
        }, HOLD_MS);
      });
    });
    return () => registerExpand(null);
  }, [p, fade]);
  if (!state) return null;
  const { from } = state;
  const lerp = (a: number, b: number) => p.interpolate({ inputRange: [0, 1], outputRange: [a, b] });
  return (
    <Animated.View
      pointerEvents="none"
      style={{ position: Platform.OS === 'web' ? ('fixed' as 'absolute') : 'absolute', left: lerp(from.x, 0), top: lerp(from.y, 0), width: lerp(from.w, width), height: lerp(from.h, height), borderRadius: lerp(state.radius, 0), backgroundColor: state.color, opacity: fade, zIndex: 999 }}
    />
  );
}
