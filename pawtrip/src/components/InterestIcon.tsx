import { Icon, type IconName } from '@/components/ui/Icon';

/** Each visible interest gets a different sticker. */
const INTEREST_ICONS: Record<string, IconName> = {
  hiking: 'int-hiking', beaches: 'int-beaches', camping: 'int-camping',
  wildlife: 'int-wildlife', lakes: 'int-lakes', museums: 'int-museums',
  viewpoints: 'int-viewpoints', food: 'cat-food', cafes: 'cat-coffee',
  dessert: 'int-dessert', breweries: 'int-breweries', wineries: 'cat-drinks',
  shopping: 'cat-shopping', fun: 'cat-fun',
};

export function InterestIcon({ interest, size = 24 }: { interest: string; size?: number }) {
  const name = INTEREST_ICONS[interest];
  return name ? <Icon name={name} size={size} /> : null;
}
