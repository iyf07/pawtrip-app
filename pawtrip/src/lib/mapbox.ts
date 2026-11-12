import tzlookup from 'tz-lookup';

const TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;

export type PlaceHit = {
  id: string;
  name: string;
  /** "Luray, Virginia, United States" */
  label: string;
  lat: number;
  lon: number;
  tz: string;
};

/** Destination typeahead (cities, towns, ZIP/postal codes) via the Mapbox Geocoding API. */
export async function searchPlaces(query: string, lang: string, signal?: AbortSignal): Promise<PlaceHit[]> {
  const q = query.trim();
  if (q.length < 2 || !TOKEN) return [];
  const url =
    `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(q)}` +
    `&types=place,locality,postcode&autocomplete=true&limit=6&language=${lang === 'zh' ? 'zh-Hans' : lang}&access_token=${TOKEN}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`geocode ${res.status}`);
  const json = await res.json();
  return (json.features ?? []).map((f: any): PlaceHit => {
    const p = f.properties;
    const lat = p.coordinates.latitude as number;
    const lon = p.coordinates.longitude as number;
    return {
      id: p.mapbox_id,
      name: p.name,
      label: p.full_address || [p.name, p.place_formatted].filter(Boolean).join(', '),
      lat,
      lon,
      tz: safeTz(lat, lon),
    };
  });
}

/** IANA time zone for a coordinate (offline lookup; replaces the prototype's state+longitude guess). */
export function safeTz(lat: number, lon: number) {
  try {
    return tzlookup(lat, lon);
  } catch {
    return 'America/New_York';
  }
}
