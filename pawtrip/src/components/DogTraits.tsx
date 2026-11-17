import { Text } from '@/components/ui/Text';
import { dogTraitKeys, type DogScale } from '@/constants/options';
import { useT, type Key } from '@/i18n';

export function DogTraits({ dog, lines }: { dog: Partial<Record<DogScale, number | null>>; lines?: number }) {
  const { t } = useT();
  const tags = dogTraitKeys(dog).map((key) => t(key as Key)).join(' · ');
  return tags ? <Text size={12} color="muted" numberOfLines={lines} accessibilityLabel={tags} style={{ marginTop: 4 }}>{tags}</Text> : null;
}
