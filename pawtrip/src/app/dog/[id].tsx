import { Redirect, useLocalSearchParams } from 'expo-router';

/** Old link (/dog/<id>) → /dogs/<id>. */
export default function LegacyDog() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Redirect href={{ pathname: '/dogs/[id]', params: { id } }} />;
}
