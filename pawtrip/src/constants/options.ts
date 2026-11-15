// Language-neutral codes stored in the database. Display text comes from i18n (`int.<code>`, `diet.<code>`).

/**
 * Broad interest categories share the Ideas activity icons. Detailed codes below are retained only
 * to map earlier saved choices into their category. Stay and transit are not interests.
 */
export const INTEREST_GROUPS: { cat: 'outdoors' | 'sights' | 'food' | 'coffee' | 'drinks' | 'shopping' | 'fun'; items: string[] }[] = [
  { cat: 'outdoors', items: ['hiking', 'beaches', 'camping', 'wildlife', 'parks', 'dogparks', 'lakes'] },
  { cat: 'sights', items: ['viewpoints', 'museums', 'landmarks', 'gardens'] },
  { cat: 'food', items: ['brunch', 'bakeries', 'patios'] },
  { cat: 'coffee', items: ['cafes', 'dessert'] },
  { cat: 'drinks', items: ['breweries', 'wine', 'cocktails'] },
  { cat: 'shopping', items: ['shopping', 'markets', 'petstores'] },
  { cat: 'fun', items: ['events', 'workshops', 'boating'] },
];
/** Broad interests; the detailed groups above also map earlier saved selections. */
export const PROFILE_INTERESTS = INTEREST_GROUPS.map((g) => g.cat);

export const normalizeInterests = (list: string[]) => [...new Set(list.flatMap((i) => {
  const group = INTEREST_GROUPS.find((g) => g.cat === i || g.items.includes(i));
  return group ? [group.cat] : [];
}))];

export const DIETS = ['vegetarian', 'vegan', 'glutenfree', 'dairyfree', 'nutallergy', 'halal', 'kosher'] as const;

/** Person travel-style scales (profile columns, 1-5). */
export const PERSON_SCALES = ['walking', 'noise', 'morning'] as const;
export type PersonScale = (typeof PERSON_SCALES)[number];
