import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import type { CatKey } from '@/constants/theme';
import { CatIcon } from '@/features/plan/CatIcon';

/** Interests with their own sticker icon. */
const OWN = ['hiking', 'beaches', 'camping', 'wildlife', 'museums', 'viewpoints', 'breweries'] as const;
/** Interests that share an activity type's icon. */
const BY_CAT: Record<string, CatKey> = { restaurants: 'food', cafes: 'coffee', shopping: 'shopping' };

export function InterestIcon({ interest, size = 24 }: { interest: string; size?: number }) {
  if ((OWN as readonly string[]).includes(interest)) return <Icon name={`int-${interest}` as 'int-hiking'} size={size} />;
  const cat = BY_CAT[interest];
  if (cat) return <CatIcon cat={cat} size={size} />;
  return (
    <Text size={Math.round(size * 0.8)} style={{ lineHeight: size, width: size, textAlign: 'center' }}>
      •
    </Text>
  );
}
