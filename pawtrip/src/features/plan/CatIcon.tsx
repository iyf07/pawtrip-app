import { Icon, type IconName } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import type { CatKey } from '@/constants/theme';

import { catEmoji } from './model';

/** Categories that already have a sticker icon; the rest fall back to their emoji until their icon is made. */
const HAS_ICON: Partial<Record<CatKey, IconName>> = {
  outdoors: 'cat-outdoors',
  coffee: 'cat-coffee',
  shopping: 'cat-shopping',
  drinks: 'cat-drinks',
  fun: 'cat-fun',
  stay: 'cat-stay',
  transit: 'cat-transit',
};

/** The icon of an activity category (sticker icon, or its emoji if that icon is not ready yet). */
export function CatIcon({ cat, size = 22 }: { cat: CatKey; size?: number }) {
  const name = HAS_ICON[cat];
  if (name) return <Icon name={name} size={size} />;
  return (
    <Text size={Math.round(size * 0.8)} style={{ lineHeight: size, width: size, textAlign: 'center' }}>
      {catEmoji(cat)}
    </Text>
  );
}
