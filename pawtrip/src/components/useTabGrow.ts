import { useEffect, useState } from 'react';
import { Animated, Easing } from 'react-native';

/** The selected tab grows sideways and the others narrow with it: animates a flex weight (1 → GROW). */
export const TAB_GROW = 1.7;
export function useTabGrow(on: boolean) {
  const [flex] = useState(() => new Animated.Value(on ? TAB_GROW : 1));
  useEffect(() => {
    Animated.timing(flex, { toValue: on ? TAB_GROW : 1, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [on, flex]);
  return flex;
}
