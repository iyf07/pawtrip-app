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
export const PERSON_SCALES = ['morning', 'noise', 'walking', 'temperature', 'pace', 'spending'] as const;
export type PersonScale = (typeof PERSON_SCALES)[number];

/** Missing answers use the neutral middle option; stored choices are preserved. */
export const personScales = (profile: Partial<Record<PersonScale, number | null>>) =>
  Object.fromEntries(PERSON_SCALES.map((field) => [field, profile[field] ?? 3])) as Record<PersonScale, number | null>;

export const INTEREST_SECTIONS = [
  { key: 'outdoors', items: ['hiking', 'beaches', 'camping', 'wildlife', 'lakes'] },
  { key: 'sights', items: ['museums', 'viewpoints'] },
  { key: 'food', items: ['food', 'cafes', 'dessert'] },
  { key: 'drinks', items: ['breweries', 'wineries'] },
  { key: 'shopping', items: ['shopping'] },
  { key: 'fun', items: ['fun'] },
] as const;

export function addDietaryNeed(current: string[], input: string): string[] {
  const custom = input.trim();
  return !custom || current.some((item) => item.toLocaleLowerCase() === custom.toLocaleLowerCase())
    ? current : [...current, custom];
}

export const DOG_SCALES = ['energy', 'temp', 'with_dogs', 'with_people', 'alone', 'car', 'recall_level'] as const;
export type DogScale = (typeof DOG_SCALES)[number];
export const dogScales = (dog: Partial<Record<DogScale, number | null>>) =>
  Object.fromEntries(DOG_SCALES.map((field) => [field, dog[field] ?? 3])) as Record<DogScale, number | null>;

export const personTraitKeys = (profile: Partial<Record<PersonScale, number | null>>) =>
  PERSON_SCALES.flatMap((field) => {
    const value = profile[field];
    return (value === 1 || value === 5) ? [`scale.${field}.${value}`] : [];
  });
