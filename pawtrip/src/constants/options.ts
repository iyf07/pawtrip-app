// Language-neutral codes stored in the database. Display text comes from i18n (`int.<code>`, `diet.<code>`).

/** Interests offered when creating a trip. */
export const TRIP_INTERESTS = ['hiking', 'restaurants', 'cafes', 'viewpoints', 'breweries', 'shopping'] as const;

/** Interests on a person's profile. */
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

export const DIETS = ['vegetarian', 'vegan', 'glutenfree', 'dairyfree', 'nutallergy', 'halal', 'kosher'] as const;

/** Person travel-style scales (profile columns, 1-5). */
export const PERSON_SCALES = ['walking', 'noise', 'morning'] as const;
export type PersonScale = (typeof PERSON_SCALES)[number];
