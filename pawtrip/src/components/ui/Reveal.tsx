import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Animated, Easing, Platform, type StyleProp, type ViewStyle } from 'react-native';

export const REVEAL_STEP = 100;
export const REVEAL_MS = 350;

/** Inside a sheet everything is already there when it opens: no staggered entrance for what it contains. */
export const NoRevealContext = createContext(false);

/**
 * List entrance: each item fades in from below and moves up into place, 350 ms ease-out, 100 ms later than the
 * item before it. Wrap every list row/card as `<Reveal index={i}>`. Runs once, when the row first mounts.
 */
export function Reveal({ index, children, style }: { index: number; children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const off = useContext(NoRevealContext);
  const [v] = useState(() => new Animated.Value(off ? 1 : 0));
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (off) return;
    const a = Animated.timing(v, { toValue: 1, duration: REVEAL_MS, delay: index * REVEAL_STEP, easing: Easing.out(Easing.cubic), useNativeDriver: Platform.OS !== 'web' });
    a.start(({ finished }) => { if (finished) setDone(true); });
    return () => a.stop();
  }, [v, index, off]);
  // web: give the moving card its own layer while it animates (shadows repainting under a fade look like flicker), then let go
  const hint = Platform.OS === 'web' && !off && !done ? ({ willChange: 'opacity, transform' } as object) : null;
  return <Animated.View style={[style, hint, { opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }] }]}>{children}</Animated.View>;
}
