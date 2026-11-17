import { dayItems, hasTime, isIdea, isLive } from '@/features/plan/model';
import { buildPins, useDayRoute, useItemCoords } from '@/features/plan/useDayGeo';
import { useTripCtx } from '@/features/trip/TripContext';

/** What the map shows for the selected day: that day's stops in time order, loose ideas and the stay as extra pins, route + drive times. */
export function useDayMap() {
  const { trip, day, items } = useTripCtx();
  const dayList = dayItems(items, day);
  const stays = items.filter((i) => isLive(i) && i.type === 'stay' && i.stayFrom != null && day >= i.stayFrom && day <= (i.stayTo ?? i.stayFrom));
  const near = { lat: trip.lat, lon: trip.lon };
  const looseIdeas = items.filter((i) => isLive(i) && isIdea(i) && !hasTime(i));
  const coords = useItemCoords([...dayList, ...looseIdeas, ...stays], near);
  const stops = [...dayList]
    .sort((a, b) => a.start! - b.start!)
    .filter((i) => coords[i.id])
    .map((i) => ({ id: i.id, ...coords[i.id] }));
  const { line, travelTo } = useDayRoute(stops);
  const pins = buildPins(
    stops,
    looseIdeas.filter((i) => coords[i.id]).map((i) => ({ id: i.id, ...coords[i.id] })),
    stays.filter((i) => coords[i.id]).map((i) => ({ id: i.id, ...coords[i.id] })),
  );
  return { dayList, stays, stops, line, travelTo, pins, center: trip.lat != null && trip.lon != null ? { lat: trip.lat, lon: trip.lon } : null };
}
