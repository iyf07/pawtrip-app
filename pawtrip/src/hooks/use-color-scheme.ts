import { useColorScheme as useSystemColorScheme } from 'react-native';

import { usePrefs } from '@/hooks/use-prefs';

/** System colour scheme unless the user chose light or dark in Settings. */
export function useColorScheme() {
  const system = useSystemColorScheme();
  const { theme } = usePrefs();
  return theme === 'system' ? system : theme;
}
