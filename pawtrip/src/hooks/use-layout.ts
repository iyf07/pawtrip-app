import { useWindowDimensions } from 'react-native';

/** Window breakpoints. `wide` = a desktop browser (side-by-side panes), `medium` = tablet / small window. */
export function useLayout() {
  const { width, height } = useWindowDimensions();
  return { width, height, wide: width >= 1000, medium: width >= 700 };
}

/** Card grid for list pages: 1 column on phones, 2 on tablets, 3 on desktops. `maxWidth` is the content column width. */
export function useColumns(maxWidth: number, gap = 14) {
  const { width } = useWindowDimensions();
  const cols = width >= 1000 ? 3 : width >= 700 ? 2 : 1;
  const avail = Math.min(width, maxWidth) - 32;
  return { cols, gap, cardWidth: Math.floor((avail - gap * (cols - 1)) / cols) };
}
