/** Ordered dog activities; interest does not imply recall ability. */
export const DOG_INTERESTS = [
  { value: 'dog_park', icon: 'scale-withdogs-5' },
  { value: 'trails', icon: 'int-hiking' },
  { value: 'camping', icon: 'int-camping' },
  { value: 'swimming', icon: 'dog-int-swimming' },
  { value: 'paddling', icon: 'int-lakes' },
  { value: 'snow', icon: 'wx-snow' },
  { value: 'sand', icon: 'int-beaches' },
  { value: 'sunbathing', icon: 'wx-sun' },
  { value: 'sniffing', icon: 'scale-recall-2' },
  { value: 'fetch', icon: 'dog-int-fetch' },
  { value: 'treats', icon: 'cat-food' },
  { value: 'sleeping', icon: 'scale-alone-4' },
  { value: 'off_leash', icon: 'scale-recall-1' },
] as const;
export type DogInterest = (typeof DOG_INTERESTS)[number]['value'];
export function normalizeDogInterests(values?: readonly string[] | null): DogInterest[] {
  return DOG_INTERESTS.filter(({ value }) => values?.includes(value)).map(({ value }) => value);
}
