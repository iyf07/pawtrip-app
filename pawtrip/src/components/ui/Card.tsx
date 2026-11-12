import type { ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

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
  const body = dashed ? (
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
          boxShadow: `0 4px 10px -3px ${t.shadow}`,
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
  if (!onPress) return body;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={accessibilityLabel} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
      {body}
    </Pressable>
  );
}
