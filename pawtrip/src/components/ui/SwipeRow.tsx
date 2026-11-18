import { useState, type ReactNode } from 'react';
import { Animated, Easing, PanResponder, Platform, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { useTheme } from '@/hooks/use-theme';

const DAMPING = 0.6; // the row follows the finger at 60 % of the distance
const TRIGGER = 0.4; // pulled past 40 % of the row's width = delete
const BACK_MS = 300;

/**
 * Swipe a list row to the left to delete it. The row follows the finger (damped to 60 %), a red delete button grows
 * in behind it; letting go past 40 % of the width fires `onTrigger` (open a confirmation), otherwise the row springs
 * back. Either way it returns in 300 ms. `enabled={false}` renders the plain row.
 */
export function SwipeRow({ children, onTrigger, enabled = true, radius = 24 }: { children: ReactNode; onTrigger: () => void; enabled?: boolean; radius?: number }) {
  const th = useTheme();
  const [width, setWidth] = useState(0);
  const [x] = useState(() => new Animated.Value(0)); // content offset, ≤ 0
  const [responder] = useState(() => {
    let w = 0;
    let fire = onTrigger;
    return { setW: (n: number) => { w = n; }, setFire: (f: () => void) => { fire = f; }, pan: PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_e, g) => g.dx < -8 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (_e, g) => x.setValue(Math.min(0, g.dx * DAMPING)),
      onPanResponderRelease: (_e, g) => {
        if (w > 0 && -g.dx > w * TRIGGER) fire();
        Animated.timing(x, { toValue: 0, duration: BACK_MS, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
      },
      onPanResponderTerminate: () => { Animated.timing(x, { toValue: 0, duration: BACK_MS, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start(); },
    }) };
  });
  responder.setW(width);
  responder.setFire(onTrigger);
  if (!enabled) return <>{children}</>;
  const reach = Math.max(40, width * TRIGGER * DAMPING * 1.6);
  const scale = x.interpolate({ inputRange: [-reach, -8, 0], outputRange: [1, 0.3, 0], extrapolate: 'clamp' });
  const reveal = x.interpolate({ inputRange: [-reach, 0], outputRange: [1, 0], extrapolate: 'clamp' });
  return (
    <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)} style={{ borderRadius: radius, overflow: 'hidden' }}>
      <Animated.View pointerEvents="none" style={{ position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, backgroundColor: th.danger, opacity: reveal, alignItems: 'flex-end', justifyContent: 'center', paddingRight: 22 }}>
        <Animated.View style={{ transform: [{ scale }] }}><Icon name="ui-trash" size={34} /></Animated.View>
      </Animated.View>
      <Animated.View {...responder.pan.panHandlers} style={[{ transform: [{ translateX: x }] }, Platform.OS === 'web' ? ({ touchAction: 'pan-y' } as object) : null]}>
        {children}
      </Animated.View>
    </View>
  );
}
