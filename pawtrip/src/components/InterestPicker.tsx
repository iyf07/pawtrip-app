import { View } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { PROFILE_INTERESTS, normalizeInterests } from '@/constants/options';
import { CatIcon } from '@/features/plan/CatIcon';
import { useT, type Key } from '@/i18n';

/** Broad interests, each with its own category sticker. */
export function InterestPicker({ value, onToggle, readOnly }: { value: string[]; onToggle?: (interest: string) => void; readOnly?: boolean }) {
  const { t } = useT();
  const selected = normalizeInterests(value);
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {PROFILE_INTERESTS.map((interest) => (
        <Chip
          key={interest}
          icon={<CatIcon cat={interest} size={28} />}
          label={t(`interest.${interest}` as Key)}
          on={selected.includes(interest)}
          onPress={readOnly ? undefined : () => onToggle?.(interest)}
          style={readOnly && !selected.includes(interest) ? { opacity: 0.45 } : undefined}
        />
      ))}
    </View>
  );
}
