import { router, type Href } from 'expo-router';

/**
 * Go back; when there is no previous screen (the page was opened or refreshed directly, e.g. from a link),
 * `router.back()` does nothing, so go home instead.
 */
export function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

/**
 * Back to the page we came from, so the push transition plays in reverse (the page slides out to the right).
 * Opened directly (nothing to go back to): replace with `fallback` instead.
 */
export function goBackTo(fallback: Href) {
  if (router.canGoBack()) router.back();
  else router.replace(fallback);
}

/**
 * Go to a top-level page (a tab) from the nav bar. It slides in like a push, but any earlier copy of that page is removed
 * from the history: plain `navigate`/`push` stacked a new page on top of the old ones on every switch, so after a few
 * switches a dozen hidden pages were still mounted and everything stuttered.
 */
export function goTab(href: Href) {
  router.push(href, { dangerouslySingular: true });
}
