import { useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import { usePrefs } from '@/hooks/use-prefs';

/**
 * System colour scheme unless the user chose light or dark in Settings.
 * On the web the system value is only trusted after hydration (static rendering has no scheme).
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const { theme } = usePrefs();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard hydration guard from the Expo template
    setHasHydrated(true);
  }, []);

  const system = useSystemColorScheme();
  if (theme !== 'system') return theme;
  return hasHydrated ? system : 'light';
}
