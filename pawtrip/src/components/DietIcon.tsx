import { Icon, type IconName } from '@/components/ui/Icon';

const HAS: readonly string[] = ['vegetarian', 'vegan', 'glutenfree', 'dairyfree', 'nutallergy', 'halal'];

/** The sticker icon of a dietary need (kosher has none yet). */
export function dietIcon(diet: string, size = 24) {
  return HAS.includes(diet) ? <Icon name={`diet-${diet}` as IconName} size={size} /> : undefined;
}
