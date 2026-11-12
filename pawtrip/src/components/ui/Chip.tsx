import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

import { Text } from './Text';

type ChipProps = { label: string; on?: boolean; onPress?: () => void; style?: StyleProp<ViewStyle> };

export function Chip({ label, on, onPress, style }: ChipProps) {
  const t = useTheme();
  return (
    <Pressable
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
          backgroundColor: on ? t.gold : t.card,
          borderColor: on ? t.gold : t.line,
        },
        style,
      ]}>
      <Text weight={700} size={14} color={on ? 'onGold' : 'text'}>
        {label}
      </Text>
    </Pressable>
  );
}

type SegProps<T extends string> = {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  wide?: boolean;
};

/** Segmented control (the prototype's `.seg`). */
export function Segmented<T extends string>({ value, options, onChange, wide }: SegProps<T>) {
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
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            style={{
              flex: wide ? 1 : undefined,
              minHeight: 38,
              paddingHorizontal: 14,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: on ? t.gold : 'transparent',
            }}>
            <Text weight={800} size={14} color={on ? 'onGold' : 'muted'}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
