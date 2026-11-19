import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';

import { Text } from '@/components/ui/Text';

export type PeopleItem = { key: string; avatar: ReactNode; name: string };

/** A row of avatars, each with its name under it; scrolls sideways when there are many. `gap` separates groups. */
export function PeopleRow({ groups }: { groups: PeopleItem[][] }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14, alignItems: 'flex-start' }}>
      {groups.filter((g) => g.length > 0).map((g, gi) => (
        <View key={gi} style={{ flexDirection: 'row', gap: 10, paddingLeft: gi ? 14 : 0, borderLeftWidth: gi ? 2 : 0, borderLeftColor: 'rgba(139,107,69,0.2)', borderStyle: 'dashed' }}>
          {g.map((p) => (
            <View key={p.key} style={{ width: 52, alignItems: 'center', gap: 4 }}>
              {p.avatar}
              <Text size={12} weight={700} numberOfLines={1} style={{ maxWidth: 52, textAlign: 'center' }}>{p.name}</Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}
