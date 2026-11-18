import { Animated, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useTabGrow } from '@/components/useTabGrow';
import { MAX_WIDTH } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type BottomTab<T extends string = string> = { value: T; label: string; icon: IconName };

/**
 * The phone's bottom tab bar (the one the trip page uses: plan / ideas / members). Every page that switches
 * between sections on a phone uses it, so the look and place are the same everywhere.
 */
export function BottomTabBar<T extends string>({ value, tabs, onChange }: { value: T; tabs: BottomTab<T>[]; onChange: (v: T) => void }) {
  const th = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ backgroundColor: th.card, borderTopWidth: 2, borderStyle: 'dashed', borderColor: th.line, alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', width: '100%', maxWidth: MAX_WIDTH, gap: 4, paddingHorizontal: 8, paddingTop: 8, paddingBottom: 8 + insets.bottom }}>
        {tabs.map((tab) => (
          <BottomTabItem key={tab.value} tab={tab} on={tab.value === value} onPress={() => { if (tab.value !== value) onChange(tab.value); }} />
        ))}
      </View>
    </View>
  );
}

function BottomTabItem({ tab, on, onPress }: { tab: BottomTab; on: boolean; onPress: () => void }) {
  const th = useTheme();
  const flex = useTabGrow(on);
  return (
    <Animated.View style={{ flex, minWidth: 0 }}>
      <Pressable onPress={onPress} accessibilityRole="tab" accessibilityState={{ selected: on }}
        style={{ minHeight: 54, borderRadius: 18, alignItems: 'center', justifyContent: 'center', gap: 2, backgroundColor: on ? th.gold : 'transparent' }}>
        <Icon name={tab.icon} size={26} />
        <Text weight={800} size={12} color={on ? 'onGold' : 'muted'} numberOfLines={1}>
          {tab.label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
