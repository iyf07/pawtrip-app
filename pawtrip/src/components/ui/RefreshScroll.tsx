import { useQueryClient } from '@tanstack/react-query';
import { forwardRef, useCallback, useRef, useState, type ComponentRef } from 'react';
import {
  ActivityIndicator,
  Platform,
  RefreshControl,
  ScrollView,
  View,
  type GestureResponderEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewProps,
} from 'react-native';

import { useTheme } from '@/hooks/use-theme';

import { Text } from './Text';

const TRIGGER = 64; // pull distance (px) that starts a refresh
const MAX_PULL = 96;

/**
 * ScrollView with pull-to-refresh: refetches everything currently on screen.
 * Native uses the system RefreshControl; the web has none, so touch pulls are tracked by hand
 * (the browser's own pull-to-refresh never fires because the page itself does not scroll).
 */
export const RefreshScroll = forwardRef<ComponentRef<typeof ScrollView>, ScrollViewProps>(function RefreshScroll({ onScroll, ...props }, ref) {
  const th = useTheme();
  const qc = useQueryClient();
  const [pull, setPull] = useState(0);
  const [busy, setBusy] = useState(false);
  const atTop = useRef(true);
  const startY = useRef<number | null>(null);

  const refresh = useCallback(async () => {
    setBusy(true);
    try {
      await Promise.all([qc.refetchQueries({ type: 'active' }), new Promise((r) => setTimeout(r, 500))]);
    } finally {
      setBusy(false);
      setPull(0);
    }
  }, [qc]);

  if (Platform.OS !== 'web') {
    return <ScrollView ref={ref} {...props} onScroll={onScroll} refreshControl={<RefreshControl refreshing={busy} onRefresh={refresh} tintColor={th.link} />} />;
  }

  const y = (e: GestureResponderEvent) => e.nativeEvent.touches?.[0]?.pageY ?? e.nativeEvent.pageY;
  const height = busy ? 44 : pull;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }} pointerEvents="none">
        {height > 8 ? (
          busy ? (
            <ActivityIndicator color={th.link} />
          ) : (
            <Text size={13} weight={700} color="muted">
              {pull >= TRIGGER ? '↻' : '↓'}
            </Text>
          )
        ) : null}
      </View>
      <ScrollView
        ref={ref}
        {...props}
        scrollEventThrottle={16}
        onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
          atTop.current = e.nativeEvent.contentOffset.y <= 0;
          onScroll?.(e);
        }}
        onTouchStart={(e) => {
          startY.current = atTop.current && !busy ? y(e) : null;
        }}
        onTouchMove={(e) => {
          if (startY.current == null) return;
          const dy = y(e) - startY.current;
          if (dy <= 0) return setPull(0);
          setPull(Math.min(MAX_PULL, dy * 0.5));
        }}
        onTouchEnd={() => {
          const go = startY.current != null && pull >= TRIGGER;
          startY.current = null;
          if (go) void refresh();
          else setPull(0);
        }}
        onTouchCancel={() => {
          startY.current = null;
          setPull(0);
        }}
      />
    </View>
  );
});
