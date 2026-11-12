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

export type AddressHit = { id: string; name: string; label: string; lat: number; lon: number };

type Near = { lat: number | null; lon: number | null };

/** Address / place typeahead for plan items, biased to the trip destination. */
export async function searchAddresses(query: string, near: Near, lang: string, signal?: AbortSignal): Promise<AddressHit[]> {
  const q = query.trim();
  if (q.length < 3 || !TOKEN) return [];
  const prox = near.lat != null && near.lon != null ? `&proximity=${near.lon},${near.lat}` : '';
  const pick = (f: any): AddressHit => {
    const p = f.properties;
    return {
      id: p.mapbox_id,
      name: p.name,
      label: p.full_address || [p.name, p.place_formatted].filter(Boolean).join(', '),
      lat: p.coordinates.latitude,
      lon: p.coordinates.longitude,
    };
  };
  // 1. Search Box: places (restaurants, trails, sights) and addresses
  const sb =
    `https://api.mapbox.com/search/searchbox/v1/forward?q=${encodeURIComponent(q)}&limit=5&autocomplete=true${prox}` +
    `&language=${lang === 'zh' ? 'zh' : lang}&access_token=${TOKEN}`;
  const res = await fetch(sb, { signal });
  if (res.ok) {
    const json = await res.json();
    const hits = (json.features ?? []).map(pick);
    if (hits.length) return hits;
  }
  // 2. Geocoding: street addresses and towns (long free-text addresses that Search Box does not match)
  const gc =
    `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(q)}&types=address,street,place,locality,postcode` +
    `&limit=5${prox}&language=${lang === 'zh' ? 'zh-Hans' : lang}&access_token=${TOKEN}`;
  const res2 = await fetch(gc, { signal });
  if (!res2.ok) throw new Error(`geocode ${res2.status}`);
  const json2 = await res2.json();
  return (json2.features ?? []).map(pick);
}

/** First match for a free-text address, or null. Used to place items that were typed without picking a suggestion. */
export async function geocodeOne(query: string, near: Near): Promise<{ lat: number; lon: number } | null> {
  try {
    const hits = await searchAddresses(query, near, 'en');
    return hits[0] ? { lat: hits[0].lat, lon: hits[0].lon } : null;
  } catch {
    return null;
  }
}

export type Route = { line: [number, number][]; /** minutes of each leg (stop i -> stop i+1) */ legs: number[] };

/** Driving route through the stops in order (2-25 points of [lon, lat]). */
export async function getRoute(points: [number, number][], signal?: AbortSignal): Promise<Route | null> {
  if (points.length < 2 || points.length > 25 || !TOKEN) return null;
  const coords = points.map((p) => p.join(',')).join(';');
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?geometries=geojson&overview=full&access_token=${TOKEN}`;
  const res = await fetch(url, { signal });
  if (!res.ok) return null;
  const json = await res.json();
  const r = json.routes?.[0];
  if (!r) return null;
  return { line: r.geometry.coordinates, legs: r.legs.map((l: any) => Math.max(1, Math.round(l.duration / 60))) };
}
