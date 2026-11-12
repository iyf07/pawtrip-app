import { ActivityIndicator, Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

import { Text } from './Text';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: 'gold' | 'ghost' | 'text' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  /** stretch to the full width of the parent */
  block?: boolean;
  small?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({ label, onPress, variant = 'gold', disabled, loading, block, small, style }: Props) {
  const t = useTheme();
  const off = disabled || loading;
  const base: ViewStyle = {
    minHeight: small ? 38 : 48,
    paddingHorizontal: small ? 14 : 22,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    alignSelf: block ? 'stretch' : 'flex-start',
    opacity: off ? 0.45 : 1,
  };
  const skin: ViewStyle =
    variant === 'gold'
      ? { backgroundColor: t.gold, borderWidth: 4, borderColor: t.sticker, boxShadow: `0 3px 8px -2px ${t.shadow}` }
      : variant === 'ghost'
        ? { backgroundColor: t.card, borderWidth: 2, borderColor: t.line }
        : variant === 'danger'
          ? { backgroundColor: t.card, borderWidth: 2, borderColor: t.line }
          : {};
  const color = variant === 'gold' ? 'onGold' : variant === 'text' ? 'link' : variant === 'danger' ? 'danger' : 'text';
  return (
    <Pressable
      onPress={off ? undefined : onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!off }}
      style={({ pressed }) => [base, skin, pressed && !off ? { transform: [{ scale: 0.98 }] } : null, style]}>
      {loading ? <ActivityIndicator color={t.onGold} size="small" /> : null}
      <Text weight={800} size={small ? 14 : 16} color={color} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}
