import { View } from 'react-native';

import { Meta, Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/use-theme';

import type { TripMapProps } from './TripMap.types';

/** iOS / Android: the native map (MapKit / Mapbox) comes with the native apps. For now a plain stop list. */
export function TripMap({ pins, height }: TripMapProps) {
  const th = useTheme();
  return (
    <View style={{ height: height === '100%' ? undefined : height, flex: height === '100%' ? 1 : undefined, borderRadius: 14, backgroundColor: th.blueBg, padding: 14, gap: 6 }}>
      {pins.length === 0 ? <Meta>—</Meta> : pins.map((p) => (
        <Text key={p.id} weight={700}>
          {p.kind === 'stop' ? p.label : p.kind === 'stay' ? '🏨' : '💡'} · {p.lat.toFixed(3)}, {p.lon.toFixed(3)}
        </Text>
      ))}
    </View>
  );
}
