import { useEffect, useState } from 'react';
import { Animated, Easing } from 'react-native';

/** The selected tab grows sideways and scales up while the others narrow and scale down (0.5 s). */
export const TAB_GROW = 1.7;
export const TAB_SCALE_ON = 1.06;
export const TAB_SCALE_OFF = 0.92;
const MS = 500;
export function useTabGrow(on: boolean) {
  const [flex] = useState(() => new Animated.Value(on ? TAB_GROW : 1));
  const [scale] = useState(() => new Animated.Value(on ? TAB_SCALE_ON : TAB_SCALE_OFF));
  useEffect(() => {
    const easing = Easing.out(Easing.cubic);
    Animated.parallel([
      Animated.timing(flex, { toValue: on ? TAB_GROW : 1, duration: MS, easing, useNativeDriver: false }),
      Animated.timing(scale, { toValue: on ? TAB_SCALE_ON : TAB_SCALE_OFF, duration: MS, easing, useNativeDriver: false }),
    ]).start();
  }, [on, flex, scale]);
  return { flex, scale };
}
