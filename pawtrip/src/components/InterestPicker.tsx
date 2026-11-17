import { View } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { Text } from '@/components/ui/Text';
import { INTEREST_SECTIONS, LEGACY_INTERESTS, normalizeInterests, selectedInterestSections } from '@/constants/options';
import { InterestIcon } from '@/components/InterestIcon';
import { useT, type Key } from '@/i18n';

/** Text-only sections group individually selectable interests with distinct stickers. */
export function InterestPicker({ value, onToggle, readOnly, selectedOnly }: { value: string[]; onToggle?: (interest: string) => void; readOnly?: boolean; selectedOnly?: boolean }) {
  const { t } = useT();
  const selected = normalizeInterests(value);
  return (
    <View style={{ gap: 18 }}>
      {(selectedOnly ? selectedInterestSections(value) : INTEREST_SECTIONS).map((section) => (
        <View key={section.key} style={{ gap: 8 }}>
          <Text size={14} weight={800} color="muted">{t(`interest.group.${section.key}` as Key)}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {section.items.map((interest) => (
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
        </View>
      ))}
      {selectedOnly && selected.filter((i) => (LEGACY_INTERESTS as readonly string[]).includes(i)).map((i) => <Chip key={i} label={t(`interest.${i}` as Key)} />)}
    </View>
  );
}
