import { useEffect, useState, type ReactNode } from 'react';
import { Animated, Easing, Platform, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';

const SIZE = 44;
const MS = 600;
type Tap = { id: number; x: number; y: number; tilt: number };

function Paw({ tap, done }: { tap: Tap; done: (id: number) => void }) {
  const [v] = useState(() => new Animated.Value(0));
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: MS, easing: Easing.out(Easing.cubic), useNativeDriver: Platform.OS !== 'web' }).start(() => done(tap.id));
  }, [v, tap.id, done]);
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: tap.x - SIZE / 2,
        top: tap.y - SIZE / 2,
        opacity: v.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 0.9, 0] }),
        transform: [{ rotate: `${tap.tilt}deg` }, { scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1.25] }) }, { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -10] }) }],
      }}>
      <Icon name="logo-paw" size={SIZE} />
    </Animated.View>
  );
}

/** A paw print pops up where you click or tap, anywhere in the app, and fades away (600 ms). Never blocks input. */
export function PawTap({ children }: { children: ReactNode }) {
  const [taps, setTaps] = useState<Tap[]>([]);
  const [done] = useState(() => (id: number) => setTaps((cur) => cur.filter((t) => t.id !== id)));
  const [seq] = useState(() => ({ n: 0 }));
  const [add] = useState(() => (x: number, y: number) => {
    seq.n += 1;
    const tap = { id: seq.n, x, y, tilt: Math.round(Math.random() * 50 - 25) };
    setTaps((cur) => [...cur.slice(-5), tap]);
  });

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const on = (e: PointerEvent) => add(e.clientX, e.clientY);
    window.addEventListener('pointerdown', on, true);
    return () => window.removeEventListener('pointerdown', on, true);
  }, [add]);

  return (
    <View style={{ flex: 1 }} onTouchStartCapture={Platform.OS === 'web' ? undefined : (e) => add(e.nativeEvent.pageX, e.nativeEvent.pageY)}>
      {children}
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        {taps.map((t) => <Paw key={t.id} tap={t} done={done} />)}
      </View>
    </View>
  );
}
