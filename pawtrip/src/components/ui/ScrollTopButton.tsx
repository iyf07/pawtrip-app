import { useEffect, useState } from 'react';
import { Animated, Easing, Pressable } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';

const SHOW_MS = 250;
const SCROLL_MS = 500;
const RISE = 12;
const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2); // slow-fast-slow cubic

/** Animate a ScrollView back to the top in 500 ms (frame by frame, so every platform gets the same curve). */
export function scrollToTopSmooth(scrollTo: (y: number) => void, fromY: number) {
  const t0 = Date.now();
  const step = () => {
    const p = Math.min(1, (Date.now() - t0) / SCROLL_MS);
    scrollTo(fromY * (1 - ease(p)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/** Round button at the bottom right: fades in and floats up 12 px once the page is scrolled past one screen. */
export function ScrollTopButton({ visible, onPress, bottom = 16 }: { visible: boolean; onPress: () => void; bottom?: number }) {
  const th = useTheme();
  const { t } = useT();
  const [v] = useState(() => new Animated.Value(0));
  useEffect(() => {
    Animated.timing(v, { toValue: visible ? 1 : 0, duration: SHOW_MS, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [visible, v]);
  return (
    <Animated.View pointerEvents={visible ? 'auto' : 'none'} style={{ position: 'absolute', right: 16, bottom, opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [RISE, 0] }) }] }}>
      <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={t('common.toTop')} hitSlop={8}
        style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: th.card, borderWidth: 2, borderColor: th.line, alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 10px -2px ${th.shadow}` }}>
        <Text plain weight={800} size={24} color="muted" style={{ lineHeight: 28 }}>↑</Text>
      </Pressable>
    </Animated.View>
  );
}
