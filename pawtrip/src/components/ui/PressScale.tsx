import { useRef, useState, type ReactNode } from 'react';
import { Animated, Easing, Platform, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

export const PRESS_SCALE = 0.94;
export const LONG_PRESS_MS = 200; // held longer than this = not a click
const SPRING = { stiffness: 260, damping: 12, mass: 1 }; // a little overshoot on release

type Props = Omit<PressableProps, 'style' | 'children'> & {
  style?: StyleProp<ViewStyle> | ((s: { pressed: boolean }) => StyleProp<ViewStyle>);
  children?: ReactNode;
};

// Press, then move off the button and let go = cancelled. React Native's default tolerates 20 px outside the button.
const NO_SLACK = { top: 0, left: 0, right: 0, bottom: 0 };
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * The press feel for every button: shrinks to 0.94 while held (callers also weaken their shadow via `pressed`),
 * and on release springs back to 1 (stiffness 260, damping 12) with a slight overshoot.
 */
export function PressScale({ style, onPressIn, onPressOut, onPress, children, ...rest }: Props) {
  const [scale] = useState(() => new Animated.Value(1));
  const [pressed, setPressed] = useState(false);
  const hold = useRef(0); // when the press began
  const native = Platform.OS !== 'web';
  return (
    <AnimatedPressable
      pressRetentionOffset={NO_SLACK}
      {...rest}
      onPress={onPress ? (e) => { if (Date.now() - hold.current <= LONG_PRESS_MS) onPress(e); } : undefined}
      onPressIn={(e) => {
        hold.current = Date.now();
        setPressed(true);
        scale.stopAnimation();
        Animated.timing(scale, { toValue: PRESS_SCALE, duration: 90, easing: Easing.out(Easing.quad), useNativeDriver: native }).start();
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        setPressed(false);
        Animated.spring(scale, { toValue: 1, ...SPRING, useNativeDriver: native }).start();
        onPressOut?.(e);
      }}
      style={[typeof style === 'function' ? style({ pressed }) : style, { transform: [{ scale }] }]}>
      {children}
    </AnimatedPressable>
  );
}

/** The weaker shadow used while a button is held down. */
export const pressedShadow = (color: string) => `0 1px 3px -1px ${color}`;
