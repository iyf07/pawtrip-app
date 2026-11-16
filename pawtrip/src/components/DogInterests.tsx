import { View } from 'react-native';
import { DOG_INTERESTS, normalizeDogInterests } from '@/constants/dog-interests';
import { useT, type Key } from '@/i18n';
import { Chip } from './ui/Chip';
import { Icon } from './ui/Icon';
import { Text } from './ui/Text';

export function DogInterests({ values, onChange }: { values?: readonly string[] | null; onChange?: (values: string[]) => void }) {
  const { t } = useT();
  const selected = normalizeDogInterests(values);
  const options = onChange ? DOG_INTERESTS : DOG_INTERESTS.filter((i) => selected.includes(i.value));
  if (!options.length) return <Text color="muted" size={14}>{t('dog.noInterests')}</Text>;
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
    {options.map(({ value, icon }) => <Chip key={value} label={t(`dogInterest.${value}` as Key)} icon={<Icon name={icon} size={28} />} on={!!onChange && selected.includes(value)}
      onPress={onChange ? () => onChange(selected.includes(value) ? selected.filter((v) => v !== value) : normalizeDogInterests([...selected, value])) : undefined} />)}
  </View>;
}
