import { Icon, type IconName } from '@/components/ui/Icon';

/** Each visible interest gets a different sticker. */
const INTEREST_ICONS: Record<string, IconName> = {
  chinese: 'int-chinese',
  japanese: 'int-japanese',
  korean: 'int-korean',
  thai: 'int-thai',
  vietnamese: 'int-vietnamese',
  indian: 'int-indian',
  italian: 'int-italian',
  pizza: 'int-pizza',
  american: 'int-american',
  mexican: 'int-mexican',
  mediterranean: 'int-mediterranean',
  markets: 'int-markets',
  live_music: 'int-live_music',
  workshops: 'int-workshops',
  amusement: 'int-amusement',
  water_sports: 'int-water_sports',
  spa: 'int-spa',

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
