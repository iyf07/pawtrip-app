import { View } from 'react-native';

import type { TripDetail } from '@/api/trips';
import { Avatar, DogAvatar } from '@/components/ui/Avatar';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';

const SIZE = 22;
const MAX = 8;

/** Everyone on the trip as overlapping avatars: people first, then dogs. Extra faces collapse into "+N". */
export function TripFaces({ trip }: { trip: TripDetail }) {
  const { t } = useT();
  const th = useTheme();

  const faces = [
    ...trip.trip_members.map((m) => ({ key: `p-${m.user_id}`, person: { id: m.user_id, name: m.profiles?.display_name, url: m.profiles?.avatar_url } })),
    ...trip.trip_dogs.flatMap((d) => (d.dogs ? [{ key: `d-${d.dog_id}`, dog: { url: d.dogs.photo_url } }] : [])),
  ];
  const shown = faces.length > MAX ? faces.slice(0, MAX - 1) : faces;
  const more = faces.length - shown.length;

  return (
    <View
      accessibilityLabel={`${t('people', { n: trip.trip_members.length })} · ${t('dogs', { n: trip.trip_dogs.length })}`}
      style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
      {shown.map((f, i) => (
        <View key={f.key} style={{ marginLeft: i === 0 ? 0 : -6 }}>
          {'person' in f && f.person ? <Avatar id={f.person.id} name={f.person.name} url={f.person.url} size={SIZE} border={1.5} /> : <DogAvatar url={'dog' in f ? f.dog?.url : null} size={SIZE} border={1.5} />}
        </View>
      ))}
      {more > 0 ? (
        <View style={{ marginLeft: -6, width: SIZE, height: SIZE, borderRadius: SIZE / 2, backgroundColor: th.line, borderWidth: 1.5, borderColor: th.sticker, alignItems: 'center', justifyContent: 'center' }}>
          <Text size={10} weight={800} style={{ lineHeight: 12 }}>
            +{more}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
