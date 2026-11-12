import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { en } from './en';
import { enExtra, zhExtra } from './extra';
import { zh as zhBase } from './zh';

const zh = { ...zhBase, ...zhExtra };

export type Lang = 'zh' | 'en';
export type Key = keyof typeof zh;
type Vars = Record<string, string | number>;

const DICTS: Record<Lang, Partial<Record<Key, string | ((v: any) => string)>>> = { zh, en: { ...en, ...enExtra } };
const STORAGE_KEY = 'pawtrip.lang';

function translate(lang: Lang, key: Key, vars: Vars = {}): string {
  const raw = DICTS[lang][key] ?? zh[key];
  if (raw === undefined) return key;
  if (typeof raw === 'function') return raw(vars);
  return raw.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? String(vars[k]) : `{${k}}`));
}

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: Key, vars?: Vars) => string; locale: string };
const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('zh');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((v) => {
        if (v === 'zh' || v === 'en') setLangState(v);
      })
      .catch(() => {});
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    AsyncStorage.setItem(STORAGE_KEY, l).catch(() => {});
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      t: (key, vars) => translate(lang, key, vars),
      locale: lang === 'zh' ? 'zh-CN' : 'en-US',
    }),
    [lang, setLang],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useT() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useT must be used inside <I18nProvider>');
  return ctx;
}
