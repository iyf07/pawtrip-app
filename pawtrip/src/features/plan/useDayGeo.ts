import { useQueries, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import type { MapPin } from '@/components/TripMap.types';
import { geocodeOne, getRoute } from '@/lib/mapbox';

import type { ItemView } from './model';

type Near = { lat: number | null; lon: number | null };

/** Geocoded places further than this from the trip destination are almost certainly a wrong match (km). */
const MAX_KM_FROM_TRIP = 300;

function km(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const rad = (d: number) => (d * Math.PI) / 180;
  const h = Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lon - a.lon) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

/**
 * Coordinates for a set of items: saved lat/lon when there is one, otherwise the address is geocoded
 * (cached in memory), so items typed without picking a suggestion still land on the map.
 */
export function useItemCoords(items: ItemView[], near: Near) {
  const missing = items.filter((i) => (i.lat == null || i.lon == null) && i.addr.trim());
  const results = useQueries({
    queries: missing.map((i) => ({
      queryKey: ['geo', i.addr.trim().toLowerCase(), near.lat, near.lon],
      queryFn: () => geocodeOne(i.addr, near),
      staleTime: Infinity,
    })),
  });
  const stamp = results.map((r) => r.dataUpdatedAt).join();
  return useMemo(() => {
    const m: Record<string, { lat: number; lon: number }> = {};
    items.forEach((i) => {
      if (i.lat != null && i.lon != null) m[i.id] = { lat: i.lat, lon: i.lon };
    });
    missing.forEach((i, k) => {
      const r = results[k]?.data;
      const far = r && near.lat != null && near.lon != null && km({ lat: near.lat, lon: near.lon }, r) > MAX_KM_FROM_TRIP;
      if (r && !far) m[i.id] = r;
    });
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, stamp]);
}

/** Driving route through a day's stops (in time order); `travelTo[id]` = minutes to reach that stop from the previous one. */
export function useDayRoute(stops: { id: string; lat: number; lon: number }[]) {
  const key = stops.map((s) => `${s.lon.toFixed(5)},${s.lat.toFixed(5)}`).join(';');
  const q = useQuery({
    queryKey: ['route', key],
    enabled: stops.length >= 2,
    staleTime: 60 * 60 * 1000,
    retry: 1,
    queryFn: () => getRoute(stops.map((s) => [s.lon, s.lat])),
  });
  const travelTo = useMemo(() => {
    const m: Record<string, number> = {};
    q.data?.legs.forEach((min, i) => {
      if (stops[i + 1]) m[stops[i + 1].id] = min;
    });
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.data, key]);
  return { line: q.data?.line ?? null, travelTo };
}

export function buildPins(stops: { id: string; lat: number; lon: number }[], ideas: { id: string; lat: number; lon: number }[], stays: { id: string; lat: number; lon: number }[]): MapPin[] {
  return [
    ...stays.map((s): MapPin => ({ id: s.id, lat: s.lat, lon: s.lon, label: '🏨', kind: 'stay' })),
    ...ideas.map((s): MapPin => ({ id: s.id, lat: s.lat, lon: s.lon, label: '💡', kind: 'idea' })),
    ...stops.map((s, i): MapPin => ({ id: s.id, lat: s.lat, lon: s.lon, label: String(i + 1), kind: 'stop' })),
  ];
}
