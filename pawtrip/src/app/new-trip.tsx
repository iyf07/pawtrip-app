import { Redirect, useLocalSearchParams } from 'expo-router';

/** Old link (/new-trip) → /trips/new (keeps the dates the calendar passes). */
export default function LegacyNewTrip() {
  const params = useLocalSearchParams<{ start?: string; end?: string }>();
  return <Redirect href={{ pathname: '/trips/new', params }} />;
}
