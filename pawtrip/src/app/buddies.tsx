import { Redirect } from 'expo-router';

/** Old link (/buddies) → /friends. */
export default function LegacyBuddies() {
  return <Redirect href="/friends" />;
}
