// Weather + sunrise/sunset from Open-Meteo (free, no key). Values are in °F.
// Real forecasts only exist ~16 days ahead; beyond that the UI shows a 5-year average and says so.

import { useQuery } from '@tanstack/react-query';

import { addDaysIso, todayIso } from './dates';

export type WxIcon = 'sun' | 'partly' | 'cloud' | 'rain' | 'storm' | 'snow' | 'fog';
export const WX_EMOJI: Record<WxIcon, string> = { sun: '☀️', partly: '⛅', cloud: '☁️', rain: '🌧️', storm: '⛈️', snow: '🌨️', fog: '🌫️' };

/** One hour of a real forecast (or recorded day). */
export type HourWx = { icon: WxIcon; /** °F */ temp: number; rainPct: number | null };

export type DayWx = {
  iso: string;
  icon: WxIcon;
  /** °F */
  hi: number;
  lo: number;
  /** minutes after midnight, in the trip's time zone */
  rise: number | null;
  set: number | null;
  /** forecast: chance of rain/snow; climate: share of past years' days that had rain or snow */
  rainPct: number | null;
  /** true when this is the average of past years, not a forecast or a recorded value */
  typical: boolean;
  /** typical days only: the date from which a real forecast exists for this day */
  forecastFrom: string | null;
  /** the 24 hours of the day; only for days within the forecast window (and recent past days), never for averages */
  hours: HourWx[] | null;
};

/** A real forecast exists for a day only when it is at most this many days away. */
export const FORECAST_DAYS = 15;
const PAST_MAX = 92; // how far back the forecast API can return recent days
const YEARS = 5; // years averaged for typical weather

function iconOf(code: number): WxIcon {
  if (code === 0) return 'sun';
  if (code <= 2) return 'partly';
  if (code === 3) return 'cloud';
  if (code === 45 || code === 48) return 'fog';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
  if (code >= 95) return 'storm';
  return 'rain';
}
const wet = (i: WxIcon) => i === 'rain' || i === 'snow' || i === 'storm';

const minOf = (s?: string | null) => {
  if (!s) return null;
  const m = /T(\d{2}):(\d{2})/.exec(s);
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
};

/** The same calendar date `n` years earlier (Feb 29 -> Feb 28). */
function yearsAgo(iso: string, n: number) {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y - n, m - 1, d);
  if (dt.getMonth() !== m - 1) dt.setDate(0);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

type Daily = {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  sunrise: string[];
  sunset: string[];
  precipitation_probability_max?: (number | null)[];
};
type Rec = { icon: WxIcon; hi: number; lo: number; rise: number | null; set: number | null; rain: number | null; hours?: HourWx[] };
type Hourly = { time: string[]; weather_code: (number | null)[]; temperature_2m: (number | null)[]; precipitation_probability?: (number | null)[] };

const FIELDS = (rain: boolean) =>
  ['weather_code', 'temperature_2m_max', 'temperature_2m_min', 'sunrise', 'sunset', ...(rain ? ['precipitation_probability_max'] : [])].join(',');

async function getDaily(url: string): Promise<Record<string, Rec>> {
  const res = await fetch(url);
  if (!res.ok) return {};
  const json = await res.json();
  const d: Daily | undefined = json.daily;
  const hourly: Hourly | undefined = json.hourly;
  // hour-by-hour values grouped by date
  const byDay: Record<string, (HourWx | undefined)[]> = {};
  hourly?.time.forEach((stamp, i) => {
    const [date, hh] = stamp.split('T');
    const temp = hourly.temperature_2m?.[i];
    const code = hourly.weather_code?.[i];
    if (temp == null || code == null) return;
    (byDay[date] ??= Array.from({ length: 24 }))[Number(hh.slice(0, 2))] = { icon: iconOf(code), temp: Math.round(temp), rainPct: hourly.precipitation_probability?.[i] ?? null };
  });
  const out: Record<string, Rec> = {};
  d?.time.forEach((iso, i) => {
    if (d.temperature_2m_max?.[i] == null || d.weather_code?.[i] == null) return;
    out[iso] = {
      icon: iconOf(d.weather_code[i]),
      hi: Math.round(d.temperature_2m_max[i]),
      lo: Math.round(d.temperature_2m_min[i]),
      rise: minOf(d.sunrise?.[i]),
      set: minOf(d.sunset?.[i]),
      rain: d.precipitation_probability_max?.[i] ?? null,
      hours: byDay[iso]?.every(Boolean) ? (byDay[iso] as HourWx[]) : undefined,
    };
  });
  return out;
}

const base = (lat: number, lon: number, tz: string) => `latitude=${lat}&longitude=${lon}&temperature_unit=fahrenheit&timezone=${encodeURIComponent(tz)}`;

/**
 * Weather for each trip day:
 *  - today .. +15 days (and up to 92 days back): the forecast API, real forecast or recorded values;
 *  - older: recorded values from the archive;
 *  - further ahead: no forecast exists yet, so the average of the same dates over the last 5 years ("typical").
 */
export async function loadWeather(lat: number, lon: number, tz: string, days: string[]): Promise<Record<string, DayWx>> {
  const today = todayIso();
  const lastLive = addDaysIso(today, FORECAST_DAYS);
  const firstRecent = addDaysIso(today, -PAST_MAX);
  const recent = days.filter((d) => d >= firstRecent && d <= lastLive);
  const old = days.filter((d) => d < firstRecent);
  const future = days.filter((d) => d > lastLive);
  const out: Record<string, DayWx> = {};

  const put = (iso: string, r: Rec) => {
    out[iso] = { iso, icon: r.icon, hi: r.hi, lo: r.lo, rise: r.rise, set: r.set, rainPct: r.rain, typical: false, forecastFrom: null, hours: r.hours ?? null };
  };

  const jobs: Promise<void>[] = [];

  if (recent.length) {
    const back = Math.min(PAST_MAX, Math.max(0, Math.round((Date.parse(today) - Date.parse(recent[0])) / 86_400_000)));
    jobs.push(
      getDaily(`https://api.open-meteo.com/v1/forecast?${base(lat, lon, tz)}&daily=${FIELDS(true)}&hourly=weather_code,temperature_2m,precipitation_probability&past_days=${back}&forecast_days=${FORECAST_DAYS + 1}`).then((m) =>
        recent.forEach((d) => m[d] && put(d, m[d])),
      ),
    );
  }

  if (old.length) {
    jobs.push(
      getDaily(`https://archive-api.open-meteo.com/v1/archive?${base(lat, lon, tz)}&daily=${FIELDS(false)}&start_date=${old[0]}&end_date=${old[old.length - 1]}`).then((m) =>
        old.forEach((d) => m[d] && put(d, m[d])),
      ),
    );
  }

  if (future.length) {
    const from = addDaysIso(future[0], -1);
    const to = addDaysIso(future[future.length - 1], 1);
    // one archive request per past year, covering the trip dates +/- 1 day
    const years = Array.from({ length: YEARS }, (_, k) => k + 1);
    jobs.push(
      Promise.all(years.map((n) => getDaily(`https://archive-api.open-meteo.com/v1/archive?${base(lat, lon, tz)}&daily=${FIELDS(false)}&start_date=${yearsAgo(from, n)}&end_date=${yearsAgo(to, n)}`))).then((perYear) => {
        future.forEach((d) => {
          const sample: Rec[] = [];
          years.forEach((n, i) => [-1, 0, 1].forEach((off) => perYear[i][yearsAgo(addDaysIso(d, off), n)] && sample.push(perYear[i][yearsAgo(addDaysIso(d, off), n)])));
          if (!sample.length) return;
          const avg = (f: (r: Rec) => number | null) => {
            const v = sample.map(f).filter((x): x is number => x != null);
            return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : null;
          };
          const counts: Partial<Record<WxIcon, number>> = {};
          sample.forEach((r) => (counts[r.icon] = (counts[r.icon] ?? 0) + 1));
          const icon = (Object.entries(counts).sort((a, b) => b[1]! - a[1]!)[0][0] as WxIcon) ?? 'partly';
          out[d] = {
            iso: d,
            icon,
            hi: avg((r) => r.hi) ?? 0,
            lo: avg((r) => r.lo) ?? 0,
            rise: avg((r) => r.rise),
            set: avg((r) => r.set),
            rainPct: Math.round((sample.filter((r) => wet(r.icon)).length / sample.length) * 100),
            typical: true,
            forecastFrom: addDaysIso(d, -FORECAST_DAYS),
            hours: null,
          };
        });
      }),
    );
  }

  await Promise.all(jobs);
  return out;
}

export function useWeather(trip: { id: string; lat: number | null; lon: number | null; tz: string }, days: string[]) {
  return useQuery({
    queryKey: ['weather', trip.id, days[0], days[days.length - 1], trip.lat, trip.lon],
    enabled: trip.lat != null && trip.lon != null && days.length > 0,
    staleTime: 60 * 60 * 1000,
    retry: 1,
    queryFn: () => loadWeather(trip.lat!, trip.lon!, trip.tz, days),
  });
}

export const tempOut = (f: number, unit: 'F' | 'C') => (unit === 'C' ? Math.round(((f - 32) * 5) / 9) : f);
