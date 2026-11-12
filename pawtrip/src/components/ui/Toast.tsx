import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MAX_WIDTH } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { Text } from './Text';

const ToastCtx = createContext<(msg: string) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((m: string) => {
    setMsg(m);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(null), 3500);
  }, []);
  const value = useMemo(() => show, [show]);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      {msg ? (
        <View
          pointerEvents="none"
          style={{ position: 'absolute', left: 0, right: 0, bottom: 92 + insets.bottom, alignItems: 'center', paddingHorizontal: 16 }}>
          <View
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
          </View>
        </View>
      ) : null}
    </ToastCtx.Provider>
  );
}
