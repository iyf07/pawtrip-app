// Weather + sunrise/sunset from Open-Meteo (free, no key).
// Dates within the 16-day forecast use the real forecast. Further dates use the same dates one year earlier
// ("typical weather", flagged so the UI can say it is not a forecast). Values are stored in °F.

import { useQuery } from '@tanstack/react-query';

import { addDaysIso, todayIso } from './dates';

export type WxIcon = 'sun' | 'partly' | 'cloud' | 'rain' | 'storm' | 'snow' | 'fog';
export const WX_EMOJI: Record<WxIcon, string> = { sun: '☀️', partly: '⛅', cloud: '☁️', rain: '🌧️', storm: '⛈️', snow: '🌨️', fog: '🌫️' };

export type DayWx = {
  iso: string;
  icon: WxIcon;
  /** °F */
  hi: number;
  lo: number;
  /** minutes after midnight, in the trip's time zone */
  rise: number | null;
  set: number | null;
  rainPct: number | null;
  /** true when this is last year's weather, not a forecast */
  typical: boolean;
};

const FORECAST_DAYS = 15; // today + 15

function iconOf(code: number): WxIcon {
  if (code === 0) return 'sun';
  if (code <= 2) return 'partly';
  if (code === 3) return 'cloud';
  if (code === 45 || code === 48) return 'fog';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
  if (code >= 95) return 'storm';
  return 'rain';
}

const minOf = (s?: string | null) => {
  if (!s) return null;
  const m = /T(\d{2}):(\d{2})/.exec(s);
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
};

/** Same calendar date one year earlier (Feb 29 -> Feb 28). */
function yearAgo(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y - 1, m - 1, d);
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

async function fetchDaily(base: string, lat: number, lon: number, tz: string, start: string, end: string, withRain: boolean): Promise<Daily | null> {
  const fields = ['weather_code', 'temperature_2m_max', 'temperature_2m_min', 'sunrise', 'sunset', ...(withRain ? ['precipitation_probability_max'] : [])].join(',');
  const url = `${base}?latitude=${lat}&longitude=${lon}&daily=${fields}&temperature_unit=fahrenheit&timezone=${encodeURIComponent(tz)}&start_date=${start}&end_date=${end}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const json = await res.json();
  return json.daily ?? null;
}

export async function loadWeather(lat: number, lon: number, tz: string, days: string[]): Promise<Record<string, DayWx>> {
  const today = todayIso();
  const last = addDaysIso(today, FORECAST_DAYS);
  const live = days.filter((d) => d >= today && d <= last);
  const typical = days.filter((d) => !live.includes(d));
  const out: Record<string, DayWx> = {};

  const put = (iso: string, d: Daily, i: number, isTypical: boolean) => {
    if (d.temperature_2m_max?.[i] == null || d.weather_code?.[i] == null) return;
    out[iso] = {
      iso,
      icon: iconOf(d.weather_code[i]),
      hi: Math.round(d.temperature_2m_max[i]),
      lo: Math.round(d.temperature_2m_min[i]),
      rise: minOf(d.sunrise?.[i]),
      set: minOf(d.sunset?.[i]),
      rainPct: isTypical ? null : (d.precipitation_probability_max?.[i] ?? null),
      typical: isTypical,
    };
  };

  const jobs: Promise<void>[] = [];
  if (live.length) {
    jobs.push(
      fetchDaily('https://api.open-meteo.com/v1/forecast', lat, lon, tz, live[0], live[live.length - 1], true).then((d) => {
        if (d) d.time.forEach((iso, i) => put(iso, d, i, false));
      }),
    );
  }
  if (typical.length) {
    const ago = typical.map(yearAgo);
    jobs.push(
      fetchDaily('https://archive-api.open-meteo.com/v1/archive', lat, lon, tz, [...ago].sort()[0], [...ago].sort()[ago.length - 1], false).then((d) => {
        if (!d) return;
        typical.forEach((iso) => {
          const i = d.time.indexOf(yearAgo(iso));
          if (i >= 0) put(iso, d, i, true);
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
