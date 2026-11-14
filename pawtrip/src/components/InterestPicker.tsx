import { View } from 'react-native';

import { NOT_INTERESTS } from '@/constants/options';
import { Chip } from '@/components/ui/Chip';
import { CatIcon } from '@/features/plan/CatIcon';
import { ITEM_CATS } from '@/features/plan/model';
import { useT, type Key } from '@/i18n';

/** Interest chips: the activity types of the Ideas tab (same names and icons), except stay and transit. */
export function InterestPicker({ value, onToggle }: { value: string[]; onToggle: (interest: string) => void }) {
  const { t } = useT();
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {ITEM_CATS.filter(([cat]) => !NOT_INTERESTS.includes(cat)).map(([cat]) => (
        <Chip key={cat} icon={<CatIcon cat={cat} size={24} />} label={t(`cat.${cat}` as Key)} on={value.includes(cat)} onPress={() => onToggle(cat)} />
      ))}
    </View>
  );
}
