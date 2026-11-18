import { Animated, View } from 'react-native';

import { PressScale } from '@/components/ui/PressScale';

import { Icon, type IconName } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useTabGrow } from '@/components/useTabGrow';
import { useTheme } from '@/hooks/use-theme';

type Tab<T extends string> = { value: T; label: string; icon: IconName };

/**
 * Light page tabs: icon above a short label, a gold underline under the active one. No pill, no heavy border:
 * it navigates between sections of one page, so it must not look like a filter toggle.
 */
export function ProfileTabs<T extends string>({ value, tabs, onChange }: { value: T; tabs: Tab<T>[]; onChange: (v: T) => void }) {
  const th = useTheme();
  return (
    <View style={{ flexDirection: 'row', borderBottomWidth: 2, borderColor: th.line }}>
      {tabs.map((tab) => (
        <ProfileTabItem key={tab.value} tab={tab} on={tab.value === value} onPress={() => onChange(tab.value)} />
      ))}
    </View>
  );
}

function ProfileTabItem<T extends string>({ tab, on, onPress }: { tab: Tab<T>; on: boolean; onPress: () => void }) {
  const th = useTheme();
  const flex = useTabGrow(on);
  return (
    <Animated.View style={{ flex, minWidth: 0 }}>
      <PressScale onPress={onPress} accessibilityRole="tab" accessibilityState={{ selected: on }}
        style={{ alignItems: 'center', gap: 2, paddingTop: 4, paddingBottom: 8, borderBottomWidth: 4, borderBottomColor: on ? th.gold : 'transparent', marginBottom: -2, opacity: on ? 1 : 0.6 }}>
        <Icon name={tab.icon} size={30} />
        <Text weight={800} size={12} color={on ? 'text' : 'muted'} numberOfLines={1}>
          {tab.label}
        </Text>
      </PressScale>
    </Animated.View>
  );
}
