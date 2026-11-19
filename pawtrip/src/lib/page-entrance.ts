import { usePathname, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Animated, Easing } from 'react-native';

/** Pages one level below the circle hub. Moving between the hub and these slides the page in from the side it came from. */
const CHILD = /^\/(dogs|friends|family)(\/|$)/;
let last: string | null = null;

/**
 * Hierarchy cue for page changes. Circle → dogs/friends/family: the new page slides in from the right (forward).
 * Back to the circle: it slides in from the left. Any other change: no movement. Works for the browser's back button too,
 * since it only looks at where we came from.
 */
export function usePageEntrance() {
  const path = usePathname();
  const [v] = useState(() => new Animated.Value(1));
  const [from] = useState(() => new Animated.Value(0)); // starting offset in px (+ right, − left)
  useFocusEffect(
    useCallback(() => {
      const prev = last;
      last = path;
      const dir = !prev ? 0 : path === '/circle' && CHILD.test(prev) ? -1 : CHILD.test(path) && prev === '/circle' ? 1 : 0;
      if (!dir) return;
      from.setValue(dir * 40);
      v.setValue(0);
      Animated.timing(v, { toValue: 1, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
    }, [path, v, from]),
  );
  return { opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] }), translateX: Animated.multiply(from, v.interpolate({ inputRange: [0, 1], outputRange: [1, 0] })) };
}
