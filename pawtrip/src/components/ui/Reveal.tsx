import { useEffect, useState, type ReactNode } from 'react';
import { Animated, Easing, Platform, type StyleProp, type ViewStyle } from 'react-native';

export const REVEAL_STEP = 50;
export const REVEAL_MS = 350;
const MAX_INDEX = 14; // a long list does not keep the last rows waiting

/**
 * List entrance: each item fades in from below and moves up into place, 350 ms ease-out, 50 ms later than the
 * item before it. Wrap every list row/card as `<Reveal index={i}>`. Runs once, when the row first mounts.
 */
export function Reveal({ index, children, style }: { index: number; children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const [v] = useState(() => new Animated.Value(0));
  useEffect(() => {
    const a = Animated.timing(v, { toValue: 1, duration: REVEAL_MS, delay: Math.min(index, MAX_INDEX) * REVEAL_STEP, easing: Easing.out(Easing.cubic), useNativeDriver: Platform.OS !== 'web' });
    a.start();
    return () => a.stop();
  }, [v, index]);
  return <Animated.View style={[style, { opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }] }]}>{children}</Animated.View>;
}
