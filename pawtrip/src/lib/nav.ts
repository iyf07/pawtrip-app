import { router } from 'expo-router';

/**
 * Go back; when there is no previous screen (the page was opened or refreshed directly, e.g. from a link),
 * `router.back()` does nothing, so go home instead.
 */
export function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}
