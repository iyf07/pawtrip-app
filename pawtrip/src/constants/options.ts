// Language-neutral codes stored in the database. Display text comes from i18n (`int.<code>`, `diet.<code>`).

/** The one interest list: used on profiles, in onboarding and when creating a trip (same names, same icons). */
export const PROFILE_INTERESTS = [
  'hiking',
  'beaches',
  'camping',
  'restaurants',
  'cafes',
  'wildlife',
  'museums',
  'shopping',
  'breweries',
  'viewpoints',
] as const;

/** The same interests, grouped for display. */
export const INTEREST_GROUPS: { key: 'outdoors' | 'food' | 'town'; items: (typeof PROFILE_INTERESTS)[number][] }[] = [
  { key: 'outdoors', items: ['hiking', 'beaches', 'camping', 'wildlife', 'viewpoints'] },
  { key: 'food', items: ['restaurants', 'cafes', 'breweries'] },
  { key: 'town', items: ['museums', 'shopping'] },
];

export const DIETS = ['vegetarian', 'vegan', 'glutenfree', 'dairyfree', 'nutallergy', 'halal', 'kosher'] as const;

/** Person travel-style scales (profile columns, 1-5). */
export const PERSON_SCALES = ['walking', 'noise', 'morning'] as const;
export type PersonScale = (typeof PERSON_SCALES)[number];
