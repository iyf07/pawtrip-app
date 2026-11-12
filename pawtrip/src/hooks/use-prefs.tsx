import { createContext, useContext, useMemo, type ReactNode } from 'react';

import { useSettings } from '@/api/profile';
import { fmtMin as fmtMinBase, fmtRange as fmtRangeBase, hourLabel as hourLabelBase } from '@/lib/time';

export type ThemePref = 'system' | 'light' | 'dark';
type Prefs = { theme: ThemePref; clock24: boolean };

const PrefsContext = createContext<Prefs>({ theme: 'system', clock24: false });

/** The signed-in user's display preferences (theme, 12/24-hour clock), read from their account settings. */
export function PrefsProvider({ children }: { children: ReactNode }) {
  const settings = useSettings();
  const theme = (settings.data?.theme as ThemePref | undefined) ?? 'system';
  const clock24 = settings.data?.time_format === '24';
  const value = useMemo(() => ({ theme, clock24 }), [theme, clock24]);
  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export const usePrefs = () => useContext(PrefsContext);

/** Time formatters bound to the user's 12/24-hour preference. */
export function useTimeFmt() {
  const { clock24 } = usePrefs();
  return useMemo(
    () => ({
      fmtMin: (m: number) => fmtMinBase(m, clock24),
      fmtRange: (a: number, b: number) => fmtRangeBase(a, b, clock24),
      hourLabel: (h: number) => hourLabelBase(h, clock24),
    }),
    [clock24],
  );
}
