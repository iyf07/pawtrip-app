// Language-neutral codes stored in the database. Display text comes from i18n (`int.<code>`, `diet.<code>`).

/** Curated interests are independently selectable, with one distinct sticker each. */
export const PROFILE_INTERESTS = [
  'hiking', 'beaches', 'camping', 'wildlife', 'lakes', 'museums', 'viewpoints',
  'food', 'cafes', 'dessert', 'breweries', 'wineries', 'shopping', 'fun',
] as const;

/** Earlier broad selections stay visible only when saved; never infer all their sub-interests. */
export const LEGACY_INTERESTS = ['outdoors', 'sights', 'coffee', 'drinks'] as const;
const RETIRED: Record<string, string> = {
  parks: 'outdoors', dogparks: 'outdoors', landmarks: 'sights', gardens: 'sights',
  brunch: 'food', patios: 'food', bakeries: 'dessert', wine: 'wineries', cocktails: 'drinks',
  markets: 'shopping', petstores: 'shopping', events: 'fun', workshops: 'fun', boating: 'fun',
};
const INTEREST_CODES = new Set<string>([...PROFILE_INTERESTS, ...LEGACY_INTERESTS]);
export const normalizeInterests = (list: string[]) => [...new Set(list
  .map((i) => RETIRED[i] ?? i)
  .filter((i) => INTEREST_CODES.has(i)))];

export const DIETS = ['vegetarian', 'vegan', 'glutenfree', 'dairyfree', 'nutallergy', 'halal', 'kosher'] as const;

/** Person travel-style scales (profile columns, 1-5). */
export const PERSON_SCALES = ['walking', 'noise', 'morning'] as const;
export type PersonScale = (typeof PERSON_SCALES)[number];
