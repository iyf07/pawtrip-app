import { Icon, type IconName } from '@/components/ui/Icon';

const HAS: readonly string[] = ['vegetarian', 'vegan', 'glutenfree', 'dairyfree', 'nutallergy', 'halal', 'kosher'];

/** The sticker icon of a standard dietary need. */
export function dietIcon(diet: string, size = 24) {
  return HAS.includes(diet) ? <Icon name={`diet-${diet}` as IconName} size={size} /> : undefined;
}
