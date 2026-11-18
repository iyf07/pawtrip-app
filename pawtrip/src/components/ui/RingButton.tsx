import { useState } from 'react';
import { ActivityIndicator, Animated, Easing, Platform, Pressable, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { Icon } from '@/components/ui/Icon';
import { useTheme } from '@/hooks/use-theme';

const SIZE = 40;
const STROKE = 3;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;
export const RING_DRAW_MS = 350; // the outline draws itself
export const RING_HALO_MS = 450; // then a glow spreads one ring outward and fades
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * Round ✓ (save) / ✗ (discard) button. On press the coloured outline draws around it in 350 ms, then a halo ring
 * spreads out and fades; the action runs when the outline is complete. Green for save, red for discard.
 */
export function RingButton({ kind, onPress, disabled, loading, label }: { kind: 'save' | 'discard'; onPress: () => void; disabled?: boolean; loading?: boolean; label: string }) {
  const th = useTheme();
  const color = kind === 'save' ? th.ok : th.danger;
  const [draw] = useState(() => new Animated.Value(0));
  const [halo] = useState(() => new Animated.Value(0));
  const [busy, setBusy] = useState(false);
  const off = disabled || loading || busy;
  const press = () => {
    if (off) return;
    setBusy(true);
    draw.setValue(0);
    halo.setValue(0);
    Animated.timing(draw, { toValue: 1, duration: RING_DRAW_MS, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start(() => {
      Animated.timing(halo, { toValue: 1, duration: RING_HALO_MS, easing: Easing.out(Easing.quad), useNativeDriver: Platform.OS !== 'web' }).start(() => setBusy(false));
      onPress();
    });
  };
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={press} disabled={disabled || loading} style={{ width: SIZE, height: SIZE }}>
      <Animated.View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, width: SIZE, height: SIZE, borderRadius: SIZE / 2, borderWidth: STROKE, borderColor: color, opacity: halo.interpolate({ inputRange: [0, 0.01, 1], outputRange: [0, 0.55, 0] }), transform: [{ scale: halo.interpolate({ inputRange: [0, 1], outputRange: [1, 1.9] }) }] }} />
      <View style={{ width: SIZE, height: SIZE, borderRadius: SIZE / 2, backgroundColor: th.card, borderWidth: 2, borderColor: th.line, alignItems: 'center', justifyContent: 'center' }}>
        {loading ? <ActivityIndicator color={th.muted} /> : <Icon name={kind === 'save' ? 'ui-save' : 'ui-discard'} size={28} />}
      </View>
      <Svg width={SIZE} height={SIZE} pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0 }}>
        <AnimatedCircle cx={SIZE / 2} cy={SIZE / 2} r={R} stroke={color} strokeWidth={STROKE} fill="none" strokeLinecap="round" strokeDasharray={`${C} ${C}`} strokeDashoffset={draw.interpolate({ inputRange: [0, 1], outputRange: [C, 0] })} transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`} />
      </Svg>
    </Pressable>
  );
}
