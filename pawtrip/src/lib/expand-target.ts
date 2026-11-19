import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NAV_HEIGHT } from '@/components/NavBar';
import { RAIL_W } from '@/components/shell/DesktopShell';
import { useLayout } from '@/hooks/use-layout';
import type { ExpandOptions } from '@/lib/expand';

/** The content area a card grows to: right of the rail on wide screens, below the top nav bar on a phone. */
export function useExpandTarget(): Pick<ExpandOptions, 'target' | 'labelTop'> {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { wide } = useLayout();
  if (wide) return { target: { x: RAIL_W, y: 0, w: width - RAIL_W, h: height }, labelTop: 22 };
  const top = insets.top + NAV_HEIGHT + 2;
  return { target: { x: 0, y: top, w: width, h: height - top }, labelTop: 4 };
}
