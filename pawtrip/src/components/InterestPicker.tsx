import { View } from 'react-native';

import { InterestIcon } from '@/components/InterestIcon';
import { Chip } from '@/components/ui/Chip';
import { Meta, Text } from '@/components/ui/Text';
import { INTEREST_GROUPS } from '@/constants/options';
import { CatIcon } from '@/features/plan/CatIcon';
import { useT, type Key } from '@/i18n';

/**
 * Interests grouped under the activity types of the Ideas tab (same names and icons in the headings).
 * In view mode only the chosen ones are shown.
 */
export function InterestPicker({ value, onToggle, readOnly }: { value: string[]; onToggle?: (interest: string) => void; readOnly?: boolean }) {
  const { t } = useT();
  if (readOnly) {
    return value.length === 0 ? (
      <Meta>—</Meta>
    ) : (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {value.map((i) => (
          <Chip key={i} icon={<InterestIcon interest={i} size={24} />} label={t(`int.${i}` as Key)} />
        ))}
      </View>
    );
  }
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
              <Chip key={i} icon={<InterestIcon interest={i} size={24} />} label={t(`int.${i}` as Key)} on={value.includes(i)} onPress={() => onToggle?.(i)} />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}
