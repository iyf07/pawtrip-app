import { useState, type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

import { PressScale, pressedShadow } from './PressScale';

type Props = {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  /** dashed outline instead of a sticker card (empty / add slots) */
  dashed?: boolean;
  accessibilityLabel?: string;
};

/** The prototype's "sticker" card: white border, soft shadow, dashed stitch line inside. */
export function Card({ children, onPress, style, dashed, accessibilityLabel }: Props) {
  const t = useTheme();
  const render = (pressed: boolean) => dashed ? (
    <View
      style={[
        {
          borderWidth: 2.5,
          borderStyle: 'dashed',
          borderColor: t.line,
          borderRadius: 18,
          paddingVertical: 14,
          paddingHorizontal: 16,
        },
        style,
      ]}>
      {children}
    </View>
  ) : (
    <View
      style={[
        {
          backgroundColor: t.card,
          borderWidth: 5,
          borderColor: t.sticker,
          borderRadius: 18,
          paddingVertical: 14,
          paddingHorizontal: 16,
          boxShadow: pressed ? pressedShadow(t.shadow) : `0 4px 10px -3px ${t.shadow}`,
        },
        style,
      ]}>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 3,
          left: 3,
          right: 3,
          bottom: 3,
          borderWidth: 1.5,
          borderStyle: 'dashed',
          borderColor: t.line,
          borderRadius: 11,
        }}
      />
      {children}
    </View>
  );
  if (!onPress) return render(false);
  return <CardPress onPress={onPress} accessibilityLabel={accessibilityLabel} render={render} />;
}

function CardPress({ onPress, accessibilityLabel, render }: { onPress: () => void; accessibilityLabel?: string; render: (pressed: boolean) => ReactNode }) {
  const [pressed, setPressed] = useState(false);
  return (
    <PressScale onPress={onPress} onPressIn={() => setPressed(true)} onPressOut={() => setPressed(false)} accessibilityRole="button" accessibilityLabel={accessibilityLabel}>
      {render(pressed)}
    </PressScale>
  );
}
