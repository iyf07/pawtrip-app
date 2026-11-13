import { View } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { Text } from '@/components/ui/Text';
import { INTEREST_GROUPS } from '@/constants/options';
import { useT, type Key } from '@/i18n';

/** Interest chips, grouped under small headings (outdoors / food & drink / in town). */
export function InterestPicker({ value, onToggle }: { value: string[]; onToggle: (interest: string) => void }) {
  const { t } = useT();
  return (
    <View style={{ gap: 12 }}>
      {INTEREST_GROUPS.map((g) => (
        <View key={g.key}>
          <Text size={12} weight={800} color="muted" style={{ marginBottom: 6 }}>
            {t(`int.group.${g.key}` as Key)}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {g.items.map((i) => (
              <Chip key={i} label={t(`int.${i}` as Key)} on={value.includes(i)} onPress={() => onToggle(i)} />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}
