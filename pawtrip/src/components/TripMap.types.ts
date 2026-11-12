export type MapPin = {
  id: string;
  lat: number;
  lon: number;
  /** number shown on a stop pin */
  label: string;
  /** stop = numbered, idea = hollow 💡, stay = 🏨 */
  kind: 'stop' | 'idea' | 'stay';
};

export type TripMapProps = {
  pins: MapPin[];
  /** route polyline as [lon, lat] points */
  line: [number, number][] | null;
  /** destination, shown when there are no pins */
  center: { lat: number; lon: number } | null;
  dark: boolean;
  onPin: (id: string) => void;
  height: number | '100%';
};
