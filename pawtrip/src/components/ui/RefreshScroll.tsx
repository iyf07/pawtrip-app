import { useQueryClient } from '@tanstack/react-query';
import { forwardRef, useCallback, useState, type ComponentRef } from 'react';
import { Platform, RefreshControl, ScrollView, type ScrollViewProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

/**
 * ScrollView with pull-to-refresh. Native uses the system RefreshControl (refetches what is on screen).
 * On the web there is NO custom pull gesture: the browser's own pull-to-reload must stay free to reload the
 * whole page (see `enableBrowserPullToReload` in the root layout, which keeps the document scrollable by 1px).
 */
export const RefreshScroll = forwardRef<ComponentRef<typeof ScrollView>, ScrollViewProps>(function RefreshScroll(props, ref) {
  const th = useTheme();
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    setBusy(true);
    try {
      await Promise.all([qc.refetchQueries({ type: 'active' }), new Promise((r) => setTimeout(r, 600))]);
    } finally {
      setBusy(false);
    }
  }, [qc]);

  if (Platform.OS !== 'web') {
    return <ScrollView ref={ref} {...props} refreshControl={<RefreshControl refreshing={busy} onRefresh={refresh} tintColor={th.link} />} />;
  }
  return <ScrollView ref={ref} {...props} />;
});
