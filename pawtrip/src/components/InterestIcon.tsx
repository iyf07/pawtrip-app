import { Icon, type IconName } from '@/components/ui/Icon';
import { INTEREST_GROUPS } from '@/constants/options';
import { CatIcon } from '@/features/plan/CatIcon';

/** Interests that have their own sticker icon; the others show the icon of the activity type they belong to. */
const OWN: Record<string, IconName> = {
  hiking: 'int-hiking',
  beaches: 'int-beaches',
  camping: 'int-camping',
  wildlife: 'int-wildlife',
  museums: 'int-museums',
  viewpoints: 'int-viewpoints',
  breweries: 'int-breweries',
};

export function InterestIcon({ interest, size = 24 }: { interest: string; size?: number }) {
  const own = OWN[interest];
  if (own) return <Icon name={own} size={size} />;
  const cat = INTEREST_GROUPS.find((g) => g.items.includes(interest))?.cat ?? 'fun';
  return <CatIcon cat={cat} size={size} />;
}
