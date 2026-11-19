import { useState, type ReactNode } from 'react';
import { Animated, Easing, Platform, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

export const PRESS_SCALE = 0.94;
const SPRING = { stiffness: 260, damping: 12, mass: 1 }; // a little overshoot on release

type Props = Omit<PressableProps, 'style' | 'children'> & {
  style?: StyleProp<ViewStyle> | ((s: { pressed: boolean }) => StyleProp<ViewStyle>);
  children?: ReactNode;
};

// The button shrinks to 94 % while held and the browser measures the shrunk box, so with no slack a finger that lands near
// the edge counted as "moved off" and the tap was cancelled (pressed, but no navigation). 16 px of slack covers the shrink
// and ordinary finger jitter; moving clearly off the button and letting go still cancels.
const NO_SLACK = { top: 16, left: 16, right: 16, bottom: 16 };
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * The press feel for every button: shrinks to 0.94 while held (callers also weaken their shadow via `pressed`),
 * and on release springs back to 1 (stiffness 260, damping 12) with a slight overshoot.
 */
export function PressScale({ style, onPressIn, onPressOut, onPress, children, ...rest }: Props) {
  const [scale] = useState(() => new Animated.Value(1));
  const [pressed, setPressed] = useState(false);
  const native = Platform.OS !== 'web';
  return (
    <AnimatedPressable
      pressRetentionOffset={NO_SLACK}
      {...rest}
      onPress={onPress}
      onPressIn={(e) => {
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
