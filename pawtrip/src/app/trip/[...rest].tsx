import { Redirect, useLocalSearchParams } from 'expo-router';

/** Old links (/trip/<id>/plan) keep working: they go to /trips/<id>/plan. */
export default function LegacyTrip() {
  const { rest } = useLocalSearchParams<{ rest: string | string[] }>();
  const path = Array.isArray(rest) ? rest.join('/') : rest;
  return <Redirect href={`/trips/${path}` as '/trips/new'} />;
}
