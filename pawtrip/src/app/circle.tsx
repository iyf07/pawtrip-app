import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { useBuddies } from '@/api/buddies';
import { useMyDogs } from '@/api/dogs';
import { useFamily } from '@/api/family';
import { AvatarStack } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { Header, Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { BENTO_GAP, Tile, TileHeader, bentoUnits } from '@/features/circle/Bento';
import { DogAccordion } from '@/features/circle/DogAccordion';
import { useT } from '@/i18n';

/**
 * Circle tab, a bento box. Every card has a small title and, at its right end, a "+" for the one thing you add there.
 * Cards are flush, 12 px apart, 24 px corners; each says one thing and opens its page one level down.
 */
export default function Circle() {
  const { t } = useT();
  const dogs = useMyDogs();
  const fam = useFamily();
  const buddies = useBuddies();
  const [width, setWidth] = useState(0);
  const { col, row } = bentoUnits(width);
  const full = col * 2 + BENTO_GAP;
  const list = dogs.data ?? [];
  const friends = (buddies.data ?? []).filter((b) => b.status === 'accepted');
  const family = fam.data?.family ?? null;
  const members = fam.data?.members ?? [];
  const pad = { flex: 1, padding: 14, gap: 8 } as const;

  return (
    <Screen nav size="narrow" top={<Header title={t('circle.title')} />}>
      <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)} style={{ marginTop: 8, gap: BENTO_GAP }}>
        {width > 0 ? (
          <>
            {/* dogs 2×2: all dogs in an accordion */}
            <Tile index={0} width={full} height={row * 2 + BENTO_GAP}>
              <View style={pad}>
                <TileHeader title={t('shell.dogs')} addLabel={t('profile.addDog')} onAdd={() => router.push('/dogs/new')} />
                <View style={{ flex: 1 }}>
                  {list.length === 0 ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Icon name="nav-dogs" size={72} /></View> : <DogAccordion dogs={list} onOpenDog={(id) => router.push({ pathname: '/dogs/[id]', params: { id } })} />}
                </View>
              </View>
            </Tile>
            {/* family 2×1 */}
            <Tile index={1} width={full} height={row} onPress={() => router.push('/family')} accessibilityLabel={t('family.tab')}>
              <View style={pad}>
                <TileHeader title={t('family.tab')} addLabel={family ? t('family.invite') : t('family.createTitle')} onAdd={() => router.push({ pathname: '/family', params: family ? { invite: '1' } : { create: '1' } })} />
                {family ? (
                  <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text weight={800} size={20} numberOfLines={1} style={{ flexShrink: 1 }}>{family.name}</Text>
                      {fam.data?.isAdmin ? <Icon name="nav-admin" size={24} /> : null}
                    </View>
                    <AvatarStack people={members.map((m) => ({ id: m.userId, name: m.name, url: m.avatar }))} max={6} size={34} />
                  </View>
                ) : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Icon name="nav-family" size={48} /></View>}
              </View>
            </Tile>
            {/* friends 1×1 (the cells next to and below it are still free) */}
            <View style={{ flexDirection: 'row', gap: BENTO_GAP }}>
              <Tile index={2} width={col} height={row} onPress={() => router.push('/friends')} accessibilityLabel={t('family.friends')}>
                <View style={pad}>
                  <TileHeader title={t('family.friends')} addLabel={t('bd.addTitle')} onAdd={() => router.push({ pathname: '/friends', params: { add: '1' } })} />
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text weight={800} size={26}>{friends.length}</Text>
                    <AvatarStack people={friends.map((b) => ({ id: b.userId, name: b.name, url: b.avatar }))} max={2} size={26} />
                  </View>
                </View>
              </Tile>
            </View>
          </>
        ) : null}
      </View>
    </Screen>
  );
}
