import { useQueryClient } from '@tanstack/react-query';
import { forwardRef, useCallback, useEffect, useRef, useState, type ComponentRef } from 'react';
import { ActivityIndicator, Platform, RefreshControl, ScrollView, View, type ScrollViewProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

import { Text } from './Text';

const TRIGGER = 64; // pull distance (px) that starts a refresh
const MAX_PULL = 110;
const HOLD = 52; // where the content rests while refreshing

type El = HTMLElement;

/**
 * ScrollView with pull-to-refresh: refetches everything currently on screen.
 * Native uses the system RefreshControl. The web has none (and the browser's own pull-to-refresh never
 * fires because the page itself does not scroll), so the pull is tracked by hand with native touch listeners
 * that move the DOM directly (no React re-render per touch move) and stop the browser's own rubber-band.
 */
export const RefreshScroll = forwardRef<ComponentRef<typeof ScrollView>, ScrollViewProps>(function RefreshScroll(props, ref) {
  const th = useTheme();
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [armed, setArmed] = useState(false);
  const busyRef = useRef(false);
  const armedRef = useRef(false);
  const scroller = useRef<ComponentRef<typeof ScrollView> | null>(null);
  const body = useRef<ComponentRef<typeof View> | null>(null);
  const hint = useRef<ComponentRef<typeof View> | null>(null);

  const refresh = useCallback(async () => {
    await Promise.all([qc.refetchQueries({ type: 'active' }), new Promise((r) => setTimeout(r, 600))]);
  }, [qc]);

  const setRefs = useCallback(
    (node: ComponentRef<typeof ScrollView> | null) => {
      scroller.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as { current: ComponentRef<typeof ScrollView> | null }).current = node;
    },
    [ref],
  );

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const scrollEl = (scroller.current as unknown as { getScrollableNode?: () => El } | null)?.getScrollableNode?.();
    const bodyEl = body.current as unknown as El | null;
    const hintEl = hint.current as unknown as El | null;
    if (!scrollEl || !bodyEl || !hintEl) return;

    let startY: number | null = null;
    let pull = 0;

    const show = (px: number, animate: boolean) => {
      bodyEl.style.transition = animate ? 'transform 220ms ease-out' : 'none';
      bodyEl.style.transform = px ? `translateY(${px}px)` : '';
      hintEl.style.opacity = String(Math.min(1, px / TRIGGER));
      const a = px >= TRIGGER;
      if (a !== armedRef.current) {
        armedRef.current = a;
        setArmed(a);
      }
    };

    const onStart = (e: TouchEvent) => {
      startY = scrollEl.scrollTop <= 0 && !busyRef.current && e.touches.length === 1 ? e.touches[0].clientY : null;
    };
    const onMove = (e: TouchEvent) => {
      if (startY == null) return;
      const dy = e.touches[0].clientY - startY;
      if (dy <= 0) {
        if (pull) show((pull = 0), false);
        return;
      }
      if (scrollEl.scrollTop > 0) return; // the list started scrolling instead
      if (e.cancelable) e.preventDefault(); // no browser rubber-band on top of ours
      pull = Math.min(MAX_PULL, dy * 0.5);
      show(pull, false);
    };
    const onEnd = async () => {
      const go = startY != null && pull >= TRIGGER;
      startY = null;
      if (!go) {
        pull = 0;
        show(0, true);
        return;
      }
      busyRef.current = true;
      setBusy(true);
      show(HOLD, true);
      try {
        await refresh();
      } finally {
        busyRef.current = false;
        setBusy(false);
        pull = 0;
        show(0, true);
      }
    };

    scrollEl.addEventListener('touchstart', onStart, { passive: true });
    scrollEl.addEventListener('touchmove', onMove, { passive: false });
    scrollEl.addEventListener('touchend', onEnd);
    scrollEl.addEventListener('touchcancel', onEnd);
    return () => {
      scrollEl.removeEventListener('touchstart', onStart);
      scrollEl.removeEventListener('touchmove', onMove);
      scrollEl.removeEventListener('touchend', onEnd);
      scrollEl.removeEventListener('touchcancel', onEnd);
    };
  }, [refresh]);

  if (Platform.OS !== 'web') {
    return <ScrollView ref={setRefs} {...props} refreshControl={<RefreshControl refreshing={busy} onRefresh={async () => { setBusy(true); try { await refresh(); } finally { setBusy(false); } }} tintColor={th.link} />} />;
  }

  return (
    <View style={{ flex: 1, overflow: 'hidden' }}>
      <View ref={hint} pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: HOLD, alignItems: 'center', justifyContent: 'center', opacity: 0 }}>
        {busy ? (
          <ActivityIndicator color={th.link} />
        ) : (
          <Text size={18} weight={800} color="muted">
            {armed ? '↻' : '↓'}
          </Text>
        )}
      </View>
      <View ref={body} style={{ flex: 1 }}>
        <ScrollView ref={setRefs} {...props} style={[{ flex: 1 }, props.style]} />
      </View>
    </View>
  );
});
