import { useEffect, useState } from 'react';
import { Animated, Easing } from 'react-native';

/** The selected tab grows sideways and scales up while the others narrow and scale down (0.5 s). */
export const TAB_GROW = 1.7;
export const TAB_SCALE_ON = 1.06;
export const TAB_SCALE_OFF = 0.92;
const MS = 500;

// Tabs that switch pages (friends / family) are remounted by the new page. Remember each tab's last state per group so
// the new page starts from the old look and animates to the new one instead of appearing finished.
const last = new Map<string, boolean>();

export function useTabGrow(on: boolean, memoryKey?: string) {
  const [p] = useState(() => new Animated.Value((memoryKey ? last.get(memoryKey) : undefined) ?? on ? 1 : 0));
  useEffect(() => {
    Animated.timing(p, { toValue: on ? 1 : 0, duration: MS, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
    if (memoryKey) last.set(memoryKey, on);
  }, [on, p, memoryKey]);
  return {
    p,
    flex: p.interpolate({ inputRange: [0, 1], outputRange: [1, TAB_GROW] }),
    scale: p.interpolate({ inputRange: [0, 1], outputRange: [TAB_SCALE_OFF, TAB_SCALE_ON] }),
  };
}
