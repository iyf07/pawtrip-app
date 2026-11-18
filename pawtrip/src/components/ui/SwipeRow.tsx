import { useState, type ReactNode } from 'react';
import { Animated, Easing, PanResponder, Platform, Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { useTheme } from '@/hooks/use-theme';

const DAMPING = 0.6; // the row follows the finger at 60 % of the distance
const TRIGGER = 0.4; // pulled past 40 % of the row's width = the delete button stays open
const BACK_MS = 300;
const OPEN_X = -96; // where the row rests while the delete button is showing

/**
 * Swipe a list row to the left to delete it. The row follows the finger (damped to 60 %) and a red delete button
 * grows in behind it. Let go past 40 % of the width and the row stays open on the button (tap it to delete, which
 * calls `onTrigger` to open the confirmation; swipe back or tap the row to close); let go earlier and it springs back
 * in 300 ms. `enabled={false}` renders the plain row.
 */
export function SwipeRow({ children, onTrigger, enabled = true, radius = 24 }: { children: ReactNode; onTrigger: () => void; enabled?: boolean; radius?: number }) {
  const th = useTheme();
  const [width, setWidth] = useState(0);
  const [open, setOpen] = useState(false);
  const [x] = useState(() => new Animated.Value(0)); // content offset, ≤ 0
  const [ctl] = useState(() => {
    let w = 0;
    const st = { open: false, start: 0, cur: 0 };
    x.addListener(({ value }) => { st.cur = value; });
    const to = (v: number) => Animated.timing(x, { toValue: v, duration: BACK_MS, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
    const settle = (o: boolean) => { st.open = o; setOpen(o); to(o ? OPEN_X : 0); };
    return {
      setW: (n: number) => { w = n; },
      st,
      close: () => settle(false),
      pan: PanResponder.create({
        onMoveShouldSetPanResponderCapture: (_e, g) => Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
        onPanResponderGrant: () => { x.stopAnimation(); st.start = st.cur; },
        onPanResponderTerminationRequest: () => false,
        onPanResponderMove: (_e, g) => x.setValue(Math.max(-w * 0.5, Math.min(0, st.start + g.dx * DAMPING))),
        onPanResponderRelease: (_e, g) => {
          if (st.open) settle(g.dx <= 24);
          else settle(w > 0 && -g.dx > w * TRIGGER);
        },
        onPanResponderTerminate: () => settle(st.open),
      }),
    };
  });
  ctl.setW(width);
  if (!enabled) return <>{children}</>;
  const reach = Math.max(40, Math.abs(OPEN_X));
  const scale = x.interpolate({ inputRange: [-reach, -8, 0], outputRange: [1, 0.3, 0], extrapolate: 'clamp' });
  const reveal = x.interpolate({ inputRange: [-reach, 0], outputRange: [1, 0], extrapolate: 'clamp' });
  return (
    <View onLayout={(e) => { ctl.setW(e.nativeEvent.layout.width); setWidth(e.nativeEvent.layout.width); }} style={{ borderRadius: radius, overflow: 'hidden' }}>
      <Animated.View style={{ position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, backgroundColor: th.danger, opacity: reveal }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Delete" onPress={() => { ctl.close(); onTrigger(); }} style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: Math.abs(OPEN_X) + 24, alignItems: 'center', justifyContent: 'center' }}>
          <Animated.View style={{ transform: [{ scale }] }}><Icon name="ui-trash" size={34} /></Animated.View>
        </Pressable>
      </Animated.View>
      <Animated.View {...ctl.pan.panHandlers} style={[{ transform: [{ translateX: x }] }, Platform.OS === 'web' ? ({ touchAction: 'pan-y' } as object) : null]}>
        {children}
        {open ? <Pressable accessibilityLabel="Close" onPress={ctl.close} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} /> : null}
      </Animated.View>
    </View>
  );
}
