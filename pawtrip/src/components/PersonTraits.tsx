import { Text } from '@/components/ui/Text';
import { personTraitKeys, type PersonScale } from '@/constants/options';
import { useT, type Key } from '@/i18n';

/** Compact, one-line titles derived from structured profile answers. No stored display text. */
export function PersonTraits({ profile, size = 11 }: { size?: number; profile?: Partial<Record<PersonScale, number | null>> | null }) {
  const { t } = useT();
  const text = personTraitKeys(profile ?? {}).map((key) => t(key as Key)).join(' · ');
  return text ? <Text size={size} color="muted" numberOfLines={1} accessibilityLabel={text} style={{ marginTop: 3 }}>{text}</Text> : null;
}
