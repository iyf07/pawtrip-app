import type { ReactNode } from 'react';
import { Animated, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTabGrow } from '@/components/useTabGrow';

import { PressScale } from './PressScale';

import type { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { Text } from './Text';

type ChipProps = { icon?: ReactNode; label: string; on?: boolean; onPress?: () => void; style?: StyleProp<ViewStyle>; /** label colour when `style` replaces the selected background */ textColor?: ThemeColor };

export function Chip({ icon, label, on, onPress, style, textColor }: ChipProps) {
  const t = useTheme();
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!on }}
      style={[
        {
          minHeight: 38,
          paddingHorizontal: 14,
          borderRadius: 18,
          borderWidth: 2,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 6,
          backgroundColor: on ? t.gold : t.card,
          borderColor: on ? t.gold : t.line,
        },
        style,
      ]}>
      {icon}
      <Text weight={700} size={14} color={textColor ?? (on ? 'onGold' : 'text')}>
        {label}
      </Text>
    </PressScale>
  );
}

type SegProps<T extends string> = {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  wide?: boolean;
  /** options that switch pages: remembers the last state so the new page animates the change */
  group?: string;
};

/** Segmented control (the prototype's `.seg`). */
export function Segmented<T extends string>({ value, options, onChange, wide, group }: SegProps<T>) {
  const t = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: t.card,
        borderWidth: 2,
        borderColor: t.line,
        borderRadius: 24,
        padding: 3,
        gap: 2,
        alignSelf: wide ? 'stretch' : 'flex-start',
      }}>
      {options.map((o) => (
        <SegOption key={o.value} label={o.label} on={o.value === value} wide={wide} memoryKey={group ? `${group}:${o.value}` : undefined} onPress={() => onChange(o.value)} />
      ))}
    </View>
  );
}

/** One option of a Segmented: the chosen one widens, scales up and turns gold; the others narrow and scale down (0.5 s). */
function SegOption({ label, on, wide, memoryKey, onPress }: { label: string; on: boolean; wide?: boolean; memoryKey?: string; onPress: () => void }) {
  const t = useTheme();
  const { p, scale } = useTabGrow(on, memoryKey);
  return (
    <Animated.View style={{ flex: wide ? 1 : undefined, transform: [{ scale }] }}>
      <PressScale onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: on }} style={{ minHeight: 38, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View style={{ borderRadius: 20, minHeight: 38, alignItems: 'center', justifyContent: 'center', paddingHorizontal: p.interpolate({ inputRange: [0, 1], outputRange: [12, 22] }), backgroundColor: p.interpolate({ inputRange: [0, 1], outputRange: ['rgba(255,199,44,0)', t.gold] }) }}>
          <Text weight={800} size={14} color={on ? 'onGold' : 'muted'}>
            {label}
          </Text>
        </Animated.View>
      </PressScale>
    </Animated.View>
  );
}
