import { Text } from '@/components/ui/Text';
import { dogTraitKeys, type DogScale } from '@/constants/options';
import { useT, type Key } from '@/i18n';

export function DogTraits({ dog }: { dog: Partial<Record<DogScale, number | null>> }) {
  const { t } = useT();
  const tags = dogTraitKeys(dog).map((key) => t(key as Key)).join(' · ');
  return tags ? <Text size={12} color="muted" accessibilityLabel={tags} style={{ marginTop: 4 }}>{tags}</Text> : null;
}
