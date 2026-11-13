import { Text } from '@/components/ui/Text';
import type { CatKey } from '@/constants/theme';
import { CatIcon } from '@/features/plan/CatIcon';

/** Interests that match an activity type use that type's sticker icon; the others use an emoji until their icon is designed. */
const BY_CAT: Record<string, CatKey> = {
  hiking: 'outdoors',
  restaurants: 'food',
  cafes: 'coffee',
  shopping: 'shopping',
  breweries: 'drinks',
  viewpoints: 'sights',
};
const EMOJI: Record<string, string> = { beaches: '🏖️', camping: '🏕️', wildlife: '🦌', museums: '🏛️' };

export function InterestIcon({ interest, size = 24 }: { interest: string; size?: number }) {
  const cat = BY_CAT[interest];
  if (cat) return <CatIcon cat={cat} size={size} />;
  return (
    <Text size={Math.round(size * 0.8)} style={{ lineHeight: size, width: size, textAlign: 'center' }}>
      {EMOJI[interest] ?? '•'}
    </Text>
  );
}
