import { useEffect, useState } from 'react';
import { Animated, Easing, Platform } from 'react-native';

import { Text } from '@/components/ui/Text';
import { registerExpand, type ExpandOptions, type Rect } from '@/lib/expand';

const GROW_MS = 260;
const HOLD_MS = 60; // the new page renders underneath
const FADE_MS = 220;

/** Sits above the app. Grows a coloured rectangle from a card to the content area, carries the title over, then fades out. */
export function ExpandOverlay() {
  const [state, setState] = useState<{ from: Rect; color: string; radius: number; opts: ExpandOptions } | null>(null);
  const [p] = useState(() => new Animated.Value(0)); // 0 = the card, 1 = the content area
  const [fade] = useState(() => new Animated.Value(1));
  useEffect(() => {
    registerExpand((from, color, radius, go, opts) => {
      setState({ from, color, radius, opts });
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
  const { from, opts } = state;
  const t = opts.target;
  const lerp = (a: number, b: number) => p.interpolate({ inputRange: [0, 1], outputRange: [a, b] });
  const fixed = Platform.OS === 'web' ? ('fixed' as 'absolute') : 'absolute';
  return (
    <Animated.View pointerEvents="none" style={{ position: fixed, left: 0, top: 0, right: 0, bottom: 0, opacity: fade, zIndex: 999 }}>
      <Animated.View style={{ position: 'absolute', left: lerp(from.x, t.x), top: lerp(from.y, t.y), width: lerp(from.w, t.w), height: lerp(from.h, t.h), borderRadius: lerp(state.radius, 0), backgroundColor: state.color, boxShadow: opts.shadow }} />
      {opts.label ? (
        <Animated.View style={{ position: 'absolute', left: t.x, width: t.w, top: t.y + (opts.labelTop ?? 4), alignItems: 'center', opacity: p.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1] }) }}>
          <Text weight={800} size={26} numberOfLines={1} style={{ color: opts.ink, maxWidth: '70%' }}>{opts.label}</Text>
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}
