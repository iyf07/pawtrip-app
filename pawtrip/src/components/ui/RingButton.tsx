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
export const RING_HALO_MS = 300; // then a glow spreads one ring outward and fades
const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);

/**
 * Round ✓ (save) / ✗ (discard) button. On press the coloured outline draws around it in 350 ms, then a halo ring
 * spreads out and fades (300 ms); the action starts immediately and gets a promise that resolves when the animation is over. Green for save, red for discard.
 */
export function RingButton({ kind, onPress, disabled, loading, label }: { kind: 'save' | 'discard'; onPress: (animationDone: Promise<void>) => unknown; disabled?: boolean; loading?: boolean; label: string }) {
  const th = useTheme();
  const color = kind === 'save' ? th.ok : th.danger;
  const [draw, setDraw] = useState(0); // 0..1, driven frame by frame (animated SVG props do not update on web)
  const [halo] = useState(() => new Animated.Value(0));
  const [busy, setBusy] = useState(false);
  const off = disabled || loading || busy;
  const press = () => {
    if (off) return;
    setBusy(true);
    setDraw(0);
    halo.setValue(0);
    // the action starts right away (the backend call must not wait for the animation); `animationDone` lets it hold
    // back what closes the edit mode until the outline and halo have played
    let finish: () => void = () => {};
    const animationDone = new Promise<void>((r) => { finish = r; });
    onPress(animationDone);
    const t0 = Date.now();
    const step = () => {
      const p = Math.min(1, (Date.now() - t0) / RING_DRAW_MS);
      setDraw(easeOut(p));
      if (p < 1) {
        requestAnimationFrame(step);
        return;
      }
      Animated.timing(halo, { toValue: 1, duration: RING_HALO_MS, easing: Easing.out(Easing.quad), useNativeDriver: Platform.OS !== 'web' }).start(() => {
        setBusy(false);
        setDraw(0);
        finish();
      });
    };
    requestAnimationFrame(step);
  };
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={press} disabled={disabled || loading} style={{ width: SIZE, height: SIZE }}>
      <Animated.View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, width: SIZE, height: SIZE, borderRadius: SIZE / 2, borderWidth: STROKE, borderColor: color, opacity: halo.interpolate({ inputRange: [0, 0.01, 1], outputRange: [0, 0.55, 0] }), transform: [{ scale: halo.interpolate({ inputRange: [0, 1], outputRange: [1, 1.9] }) }] }} />
      <View style={{ width: SIZE, height: SIZE, borderRadius: SIZE / 2, backgroundColor: th.card, borderWidth: 2, borderColor: th.line, alignItems: 'center', justifyContent: 'center' }}>
        {loading ? <ActivityIndicator color={th.muted} /> : <Icon name={kind === 'save' ? 'ui-save' : 'ui-discard'} size={28} />}
      </View>
      <Svg width={SIZE} height={SIZE} pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0 }}>
        <Circle cx={SIZE / 2} cy={SIZE / 2} r={R} stroke={color} strokeWidth={STROKE} fill="none" strokeLinecap="round" strokeDasharray={`${C} ${C}`} strokeDashoffset={C * (1 - draw)} transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`} />
      </Svg>
    </Pressable>
  );
}
