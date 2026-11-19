/** Only an explicit item selection opens the desktop secondary list. */
export function collectionDetail(path: string, friend?: string) {
  const trip = /^\/trips\/([^/]+)/.exec(path)?.[1];
  if (trip && trip !== 'new') return { kind: 'trips' as const, id: trip, home: '/trips' as const };
  const dog = /^\/dogs\/([^/]+)/.exec(path)?.[1];
  if (dog && dog !== 'new') return { kind: 'dogs' as const, id: dog, home: '/dogs' as const };
  if (path === '/friends' && friend) return { kind: 'friends' as const, id: friend, home: '/friends' as const };
  return null;
}
