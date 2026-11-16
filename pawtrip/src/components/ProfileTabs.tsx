import { Pressable, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
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
      {tabs.map((tab) => {
        const on = tab.value === value;
        return (
          <Pressable
            key={tab.value}
            onPress={() => onChange(tab.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            style={{ flex: 1, alignItems: 'center', gap: 2, paddingTop: 4, paddingBottom: 8, borderBottomWidth: 4, borderBottomColor: on ? th.gold : 'transparent', marginBottom: -2, opacity: on ? 1 : 0.6 }}>
            <Icon name={tab.icon} size={30} />
            <Text weight={800} size={12} color={on ? 'text' : 'muted'}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
