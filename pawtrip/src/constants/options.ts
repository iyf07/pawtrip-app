// Language-neutral codes stored in the database. Display text comes from i18n (`int.<code>`, `diet.<code>`).

/**
 * Interests are the activity types of the Ideas tab (outdoors, food, coffee, sights, shopping, drinks, fun, stay,
 * transit): one list, same names, same icons on profiles, in onboarding, when creating a trip and when adding ideas.
 * Older profiles stored finer codes (hiking, cafes ...); they are mapped to the type they belong to when loaded.
 */
const LEGACY: Record<string, string> = {
  hiking: 'outdoors',
  beaches: 'outdoors',
  camping: 'outdoors',
  wildlife: 'outdoors',
  viewpoints: 'sights',
  museums: 'sights',
  restaurants: 'food',
  cafes: 'coffee',
  breweries: 'drinks',
};
/** Lodging and transport are activity types, not interests. */
export const NOT_INTERESTS: readonly string[] = ['stay', 'transit'];
export const normalizeInterests = (list: string[]) => [...new Set(list.map((i) => LEGACY[i] ?? i))].filter((i) => !NOT_INTERESTS.includes(i));

export const DIETS = ['vegetarian', 'vegan', 'glutenfree', 'dairyfree', 'nutallergy', 'halal', 'kosher'] as const;

/** Person travel-style scales (profile columns, 1-5). */
export const PERSON_SCALES = ['walking', 'noise', 'morning'] as const;
export type PersonScale = (typeof PERSON_SCALES)[number];
