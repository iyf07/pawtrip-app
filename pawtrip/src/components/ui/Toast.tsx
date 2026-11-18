import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Animated, Easing, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MAX_WIDTH } from '@/constants/theme';
import { useLayout } from '@/hooks/use-layout';
import { useTheme } from '@/hooks/use-theme';

import { Text } from './Text';

const ToastCtx = createContext<(msg: string) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { wide } = useLayout();
  const [shown, setShown] = useState<{ id: number; text: string } | null>(null);
  const [v] = useState(() => new Animated.Value(0));
  const seq = useRef(0);

  const show = useCallback((m: string) => {
    seq.current += 1;
    setShown({ id: seq.current, text: m });
  }, []);

  // enter: slide up 28 px + fade in over 260 ms, stay 1200 ms, fade out
  useEffect(() => {
    if (!shown) return;
    const native = Platform.OS !== 'web';
    v.setValue(0);
    const anim = Animated.sequence([
      Animated.timing(v, { toValue: 1, duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: native }),
      Animated.delay(1200),
      Animated.timing(v, { toValue: 0, duration: 260, easing: Easing.in(Easing.quad), useNativeDriver: native }),
    ]);
    anim.start(({ finished }) => {
      if (finished) setShown(null);
    });
    return () => anim.stop();
  }, [shown, v]);
  const msg = shown?.text ?? null;
  const value = useMemo(() => show, [show]);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      {msg ? (
        <Animated.View
          pointerEvents="none"
          style={{ position: 'absolute', left: 0, right: 0, bottom: wide ? 28 : 92 + insets.bottom, alignItems: 'center', paddingHorizontal: 16, opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [28, 0] }) }] }}>
          <Animated.View
            accessibilityLiveRegion="polite"
            style={{
              maxWidth: MAX_WIDTH - 32,
              backgroundColor: t.toastBg,
              borderRadius: 24,
              paddingVertical: 12,
              paddingHorizontal: 18,
              boxShadow: '0 8px 20px -8px rgba(0,0,0,0.4)',
            }}>
            <Text weight={700} size={15} style={{ color: t.toastText }}>
              {msg}
            </Text>
          </Animated.View>
        </Animated.View>
      ) : null}
    </ToastCtx.Provider>
  );
}
