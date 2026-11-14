// Language-neutral codes stored in the database. Display text comes from i18n (`int.<code>`, `diet.<code>`).

/**
 * Interests are finer than the activity types of the Ideas tab and are grouped under them: each group is one
 * activity type (same name, same icon as on the Ideas tab). Stay and transit are not interests.
 */
export const INTEREST_GROUPS: { cat: 'outdoors' | 'sights' | 'food' | 'coffee' | 'drinks' | 'shopping' | 'fun'; items: string[] }[] = [
  { cat: 'outdoors', items: ['hiking', 'beaches', 'camping', 'wildlife', 'parks', 'dogparks', 'lakes'] },
  { cat: 'sights', items: ['viewpoints', 'museums', 'landmarks', 'gardens'] },
  { cat: 'food', items: ['restaurants', 'brunch', 'bakeries', 'patios'] },
  { cat: 'coffee', items: ['cafes', 'dessert'] },
  { cat: 'drinks', items: ['breweries', 'wine', 'cocktails'] },
  { cat: 'shopping', items: ['shopping', 'markets', 'petstores'] },
  { cat: 'fun', items: ['events', 'workshops', 'boating'] },
];
export const PROFILE_INTERESTS = INTEREST_GROUPS.flatMap((g) => g.items);

/** Keep only interests that still exist (older saves used the activity-type codes). */
export const normalizeInterests = (list: string[]) => [...new Set(list)].filter((i) => PROFILE_INTERESTS.includes(i));

export const DIETS = ['vegetarian', 'vegan', 'glutenfree', 'dairyfree', 'nutallergy', 'halal', 'kosher'] as const;

/** Person travel-style scales (profile columns, 1-5). */
export const PERSON_SCALES = ['walking', 'noise', 'morning'] as const;
export type PersonScale = (typeof PERSON_SCALES)[number];
