import type { Key } from '@/i18n';

type TFn = (key: Key, vars?: Record<string, string | number>) => string;

/** "2 h 30 min" in the current language. */
export function hrsLabel(mins: number, t: TFn) {
  const m = Math.round(mins);
  const h = Math.floor(m / 60);
  const r = m % 60;
  return h && r ? t('dur.hm', { h, m: r }) : h ? t('dur.h', { h }) : t('dur.min', { m });
}

/** "5 min ago" style relative time. */
export function relTime(ts: number, t: TFn) {
  const m = Math.round((Date.now() - ts) / 60000);
  if (m < 1) return t('time.justNow');
  if (m < 60) return t('time.min', { n: m });
  const h = Math.round(m / 60);
  if (h < 24) return t('time.hour', { n: h });
  return t('time.day', { n: Math.round(h / 24) });
}
