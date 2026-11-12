// Dates are plain "YYYY-MM-DD" strings everywhere (no time zones); times are minutes after midnight.

export const isoOf = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const parseIso = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const todayIso = () => isoOf(new Date());

export const addDaysIso = (iso: string, n: number) => {
  const d = parseIso(iso);
  d.setDate(d.getDate() + n);
  return isoOf(d);
};

export const daysBetween = (a: string, b: string) =>
  Math.round((parseIso(b).getTime() - parseIso(a).getTime()) / 86_400_000);

export const MAX_TRIP_DAYS = 14;

/** Every date from start to end, inclusive. */
export function buildDays(start: string, end: string) {
  const out: string[] = [];
  for (let i = 0; i <= daysBetween(start, end) && i < 60; i++) out.push(addDaysIso(start, i));
  return out;
}

/** "Nov 15–17" / "11月15日–17日" */
export function datesLabel(start: string, end: string, locale: string) {
  const a = parseIso(start);
  const b = parseIso(end);
  const zh = locale.startsWith('zh');
  const month = (d: Date) => (zh ? `${d.getMonth() + 1}月` : d.toLocaleDateString(locale, { month: 'short' }));
  if (start === end) return zh ? `${month(a)}${a.getDate()}日` : `${month(a)} ${a.getDate()}`;
  if (a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()) {
    return zh ? `${month(a)}${a.getDate()}–${b.getDate()}日` : `${month(a)} ${a.getDate()}–${b.getDate()}`;
  }
  return zh
    ? `${month(a)}${a.getDate()}日–${month(b)}${b.getDate()}日`
    : `${month(a)} ${a.getDate()} – ${month(b)} ${b.getDate()}`;
}

export const weekdayShort = (iso: string, locale: string) =>
  parseIso(iso).toLocaleDateString(locale, { weekday: 'short' });
