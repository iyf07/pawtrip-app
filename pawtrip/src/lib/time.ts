// Times are minutes after midnight.

export const fmtMin = (min: number, is24 = false) => {
  const h = Math.floor(min / 60) % 24;
  const m = String(min % 60).padStart(2, '0');
  return is24 ? `${h}:${m}` : `${h % 12 || 12}:${m} ${h >= 12 ? 'PM' : 'AM'}`;
};

export const fmtRange = (a: number, b: number, is24 = false) => `${fmtMin(a, is24)} – ${fmtMin(b, is24)}`;

export const hourLabel = (h: number, is24 = false) => (is24 ? `${h % 24}:00` : `${(h + 11) % 12 + 1} ${h % 24 >= 12 ? 'PM' : 'AM'}`);

/** Current date and minute-of-day in an IANA time zone (the trip's), e.g. to know whether an activity has ended. */
export function nowIn(tz: string, now = new Date()) {
  try {
    const p = Object.fromEntries(
      new Intl.DateTimeFormat('en-CA', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
        .formatToParts(now)
        .map((x) => [x.type, x.value]),
    );
    return { date: `${p.year}-${p.month}-${p.day}`, min: Number(p.hour) * 60 + Number(p.minute) };
  } catch {
    return { date: now.toISOString().slice(0, 10), min: now.getHours() * 60 + now.getMinutes() };
  }
}

/** Half-hour options for the time picker. */
export const HALF_HOURS = Array.from({ length: 49 }, (_, i) => i * 30);
