import { Animated, Easing } from 'react-native';
import type { StackCardInterpolationProps, StackCardInterpolatedStyle } from 'expo-router/js-stack';

export const PUSH_MS = 350; // the new page slides in
export const PUSH_BACK_PX = 90; // the old page moves this far left meanwhile
export const PUSH_DIM = 0.25; // and is pressed down (dimmed) by this much

/**
 * Page push. The new page slides in from the right; the page under it moves 90 px to the left and dims by 25 % over the
 * same 350 ms. Going back plays the same motion in reverse (the stack drives `progress` back to 0).
 */
export function pushInterpolator({ current, next, layouts }: StackCardInterpolationProps): StackCardInterpolatedStyle {
  const enter = current.progress.interpolate({ inputRange: [0, 1], outputRange: [layouts.screen.width, 0], extrapolate: 'clamp' });
  const away = next ? next.progress.interpolate({ inputRange: [0, 1], outputRange: [0, -PUSH_BACK_PX], extrapolate: 'clamp' }) : 0;
  return {
    cardStyle: { transform: [{ translateX: Animated.add(enter, away) }] },
    overlayStyle: { opacity: next ? next.progress.interpolate({ inputRange: [0, 1], outputRange: [0, PUSH_DIM], extrapolate: 'clamp' }) : 0 },
  };
}

const spec = { animation: 'timing' as const, config: { duration: PUSH_MS, easing: Easing.out(Easing.cubic) } };
export const pushSpec = { open: spec, close: spec };
