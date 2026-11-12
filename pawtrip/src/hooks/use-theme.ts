import { CAT_COLORS, Colors, type CatKey, type Theme } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme(): Theme {
  const scheme = useColorScheme();
  return Colors[scheme === 'dark' ? 'dark' : 'light'];
}

/** Accent + tint colours for an item category in the current colour scheme. */
export function useCatColors(cat: CatKey) {
  const scheme = useColorScheme();
  return CAT_COLORS[scheme === 'dark' ? 'dark' : 'light'][cat];
}
