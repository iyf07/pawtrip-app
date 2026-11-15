import { View } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { LEGACY_INTERESTS, PROFILE_INTERESTS, normalizeInterests } from '@/constants/options';
import { InterestIcon } from '@/components/InterestIcon';
import { useT, type Key } from '@/i18n';

/** Curated interests plus any earlier broad selections the user has saved. */
export function InterestPicker({ value, onToggle, readOnly }: { value: string[]; onToggle?: (interest: string) => void; readOnly?: boolean }) {
  const { t } = useT();
  const selected = normalizeInterests(value);
  const options = [...PROFILE_INTERESTS, ...LEGACY_INTERESTS.filter((i) => selected.includes(i))];
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {options.map((interest) => (
        <Chip
          key={interest}
          icon={<InterestIcon interest={interest} size={28} />}
          label={t(`interest.${interest}` as Key)}
          on={selected.includes(interest)}
          onPress={readOnly ? undefined : () => onToggle?.(interest)}
          style={readOnly && !selected.includes(interest) ? { opacity: 0.45 } : undefined}
        />
      ))}
    </View>
  );
}
