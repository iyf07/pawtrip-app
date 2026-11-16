import { Pressable } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Text } from './Text';

/** Shared top-right collection creation action. */
export function AddAction({ label, onPress }: { label: string; onPress: () => void }) {
  const th = useTheme();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label}
      style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: th.gold, borderWidth: 3, borderColor: th.sticker, alignItems: 'center', justifyContent: 'center', boxShadow: `0 3px 8px -2px ${th.shadow}` }}>
      <Text plain size={24} weight={800} color="onGold" style={{ lineHeight: 28 }}>+</Text>
    </Pressable>
  );
}
