import { View } from 'react-native';
import { DOG_INTERESTS, normalizeDogInterests } from '@/constants/dog-interests';
import { useT, type Key } from '@/i18n';
import { Chip } from './ui/Chip';
import { Icon } from './ui/Icon';
import { Reveal } from './ui/Reveal';

export function DogInterests({ values, onChange }: { values?: readonly string[] | null; onChange?: (values: string[]) => void }) {
  const { t } = useT();
  const selected = normalizeDogInterests(values);
  const options = onChange ? DOG_INTERESTS : DOG_INTERESTS.filter((i) => selected.includes(i.value));
  if (!options.length) return <View style={{ alignItems: 'flex-start' }}><Chip icon={<Icon name="empty-discover" size={28} />} label={t('dog.emptyInterests')} /></View>;
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
    {options.map(({ value, icon }, n) => <Reveal key={value} index={n}><Chip label={t(`dogInterest.${value}` as Key)} icon={<Icon name={icon} size={28} />} on={!!onChange && selected.includes(value)}
      onPress={onChange ? () => onChange(selected.includes(value) ? selected.filter((v) => v !== value) : normalizeDogInterests([...selected, value])) : undefined} /></Reveal>)}
  </View>;
}
