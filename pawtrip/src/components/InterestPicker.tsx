import { View } from 'react-native';

import { InterestIcon } from '@/components/InterestIcon';
import { Chip } from '@/components/ui/Chip';
import { Text } from '@/components/ui/Text';
import { INTEREST_GROUPS } from '@/constants/options';
import { CatIcon } from '@/features/plan/CatIcon';
import { useT, type Key } from '@/i18n';

/** Interests grouped under the activity types of the Ideas tab (same names and icons in the headings). */
export function InterestPicker({ value, onToggle }: { value: string[]; onToggle: (interest: string) => void }) {
  const { t } = useT();
  return (
    <View style={{ gap: 14 }}>
      {INTEREST_GROUPS.map((g) => (
        <View key={g.cat}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <CatIcon cat={g.cat} size={20} />
            <Text size={13} weight={800} color="muted">
              {t(`cat.${g.cat}` as Key)}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {g.items.map((i) => (
              <Chip key={i} icon={<InterestIcon interest={i} size={24} />} label={t(`int.${i}` as Key)} on={value.includes(i)} onPress={() => onToggle(i)} />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}
