import { Redirect } from 'expo-router';

/** The calendar now lives on the trips page. */
export default function Calendar() {
  return <Redirect href="/trips" />;
}
