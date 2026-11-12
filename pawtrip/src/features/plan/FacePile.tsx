import { View } from 'react-native';

import { Avatar, DogAvatar } from '@/components/ui/Avatar';
import { Meta, Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/use-theme';
import { useTripCtx } from '@/features/trip/TripContext';

import { DOG_MODE_ICON, MOODS, dogMode, type ItemView } from './model';

/**
 * Everyone's face for an item: full colour + green ring = going, faded = no reply / maybe, crossed = can't go.
 * Dogs follow, with a small badge for how each spends the item.
 */
export function FacePile({ item, size = 20 }: { item: ItemView; size?: number }) {
  const th = useTheme();
  const { members, dogs } = useTripCtx();
  const nGo = members.filter((m) => item.rsvp[m.id] === 'going').length;
  const nSet = dogs.filter((d) => dogMode(item, d.id) !== 'tbd').length;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
      {members.map((m) => {
        const r = item.rsvp[m.id];
        return (
          <View
            key={m.id}
            accessibilityLabel={m.name}
            style={{
              borderRadius: size,
              opacity: r === 'going' ? 1 : 0.4,
              borderWidth: r === 'going' ? 2 : 0,
              borderColor: th.ok,
              padding: 0,
            }}>
            <Avatar id={m.id} name={m.name} url={m.url} size={size} border={1.5} />
            {r === 'no' ? (
              <View pointerEvents="none" style={{ position: 'absolute', left: -1, right: -1, top: '50%', height: 2, backgroundColor: th.danger, transform: [{ rotate: '-45deg' }] }} />
            ) : null}
          </View>
        );
      })}
      <Meta weight={800} size={11} style={{ marginLeft: 2 }}>
        {nGo}/{members.length}
      </Meta>
      {dogs.length ? (
        <>
          <View style={{ width: 1, height: 14, backgroundColor: th.line, marginHorizontal: 4 }} />
          {dogs.map((d) => {
            const mode = dogMode(item, d.id);
            const mood = item.mood[d.id];
            const badge = mood ? MOODS.find((m) => m[0] === mood)?.[1] : mode === 'tbd' ? null : DOG_MODE_ICON[mode];
            return (
              <View key={d.id} style={{ opacity: mode === 'tbd' ? 0.4 : 1 }}>
                <DogAvatar url={d.photo} size={size} border={1.5} />
                {badge ? (
                  <View style={{ position: 'absolute', right: -5, bottom: -4, width: 13, height: 13, borderRadius: 7, backgroundColor: th.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: th.line }}>
                    <Text size={8} style={{ lineHeight: 11 }}>
                      {badge}
                    </Text>
                  </View>
                ) : null}
              </View>
            );
          })}
          <Meta weight={800} size={11} style={{ marginLeft: 2 }}>
            {nSet}/{dogs.length}
          </Meta>
        </>
      ) : null}
    </View>
  );
}
