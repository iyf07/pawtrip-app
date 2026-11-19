import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { useBuddies } from '@/api/buddies';
import { useMyDogs } from '@/api/dogs';
import { useFamily } from '@/api/family';
import { NotificationBell } from '@/components/NotificationBell';
import { AvatarStack } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { Header, Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { JoinFamilySheet } from '@/features/family/FamilyCodeSheets';
import { BENTO_GAP, Tile, bentoUnits } from '@/features/circle/Bento';
import { DogAccordion } from '@/features/circle/DogAccordion';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';

/**
 * Circle tab, a bento box: dogs (every dog in an accordion), family, friends, requests, and two quick adds.
 * Cards are flush, 12 px apart, 24 px corners; each says one thing and opens its page one level down.
 */
export default function Circle() {
  const { t } = useT();
  const th = useTheme();
  const dogs = useMyDogs();
  const fam = useFamily();
  const buddies = useBuddies();
  const [width, setWidth] = useState(0);
  const [joining, setJoining] = useState(false);
  const { col, row } = bentoUnits(width);
  const full = col * 2 + BENTO_GAP;
  const list = dogs.data ?? [];
  const friends = (buddies.data ?? []).filter((b) => b.status === 'accepted');
  const family = fam.data?.family ?? null;
  const members = fam.data?.members ?? [];

  const label = (text: string) => <Text weight={800} size={16} numberOfLines={1}>{text}</Text>;

  return (
    <Screen nav size="narrow" top={<Header title={t('circle.title')} />}>
      <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)} style={{ marginTop: 8, gap: BENTO_GAP }}>
        {width > 0 ? (
          <>
            {/* dogs 2×2 */}
            {list.length === 0 ? (
              <Tile index={0} width={full} height={row * 2 + BENTO_GAP} dashed onPress={() => router.push('/dogs/new')} accessibilityLabel={t('profile.addDog')}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 }}><Icon name="nav-dogs" size={72} /><Text weight={800} size={18} color="link">{t('profile.addDog')}</Text></View>
              </Tile>
            ) : (
              <Tile index={0} width={full} height={row * 2 + BENTO_GAP}><DogAccordion dogs={list} onOpenDog={(id) => router.push({ pathname: '/dogs/[id]', params: { id } })} onAdd={() => router.push('/dogs/new')} /></Tile>
            )}
            {/* family 2×1 */}
            {family ? (
              <Tile index={1} width={full} height={row} onPress={() => router.push('/family')} accessibilityLabel={family.name}>
                <View style={{ flex: 1, padding: 16, justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Icon name="nav-family" size={28} />
                    <Text weight={800} size={20} numberOfLines={1} style={{ flex: 1 }}>{family.name}</Text>
                    {fam.data?.isAdmin ? <Icon name="nav-admin" size={26} /> : null}
                  </View>
                  <AvatarStack people={members.map((m) => ({ id: m.userId, name: m.name, url: m.avatar }))} max={6} size={36} />
                </View>
              </Tile>
            ) : (
              <Tile index={1} width={full} height={row} dashed onPress={() => router.push('/family')} accessibilityLabel={t('family.createTitle')}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}><Icon name="nav-family" size={40} /><Text weight={800} size={18} color="link">{t('family.createTitle')}</Text></View>
              </Tile>
            )}
            {/* friends | requests */}
            <View style={{ flexDirection: 'row', gap: BENTO_GAP }}>
              <Tile index={2} width={col} height={row} onPress={() => router.push('/friends')} accessibilityLabel={t('shell.buddies')}>
                <View style={{ flex: 1, padding: 14, justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><Icon name="tab-members" size={28} />{label(t('shell.buddies'))}</View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text weight={800} size={26}>{friends.length}</Text>
                    <AvatarStack people={friends.map((b) => ({ id: b.userId, name: b.name, url: b.avatar }))} max={3} size={26} />
                  </View>
                </View>
              </Tile>
              <NotificationBell size={28} box={28} radius={14} renderTrigger={(count, open) => (
                <Tile index={3} width={col} height={row} onPress={open} accessibilityLabel={t('notif.title')}>
                  <View style={{ flex: 1, padding: 14, justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><Icon name="nav-notifications" size={28} />{label(t('notif.title'))}</View>
                    <Text weight={800} size={26} style={{ color: count > 0 ? th.danger : th.muted }}>{count}</Text>
                  </View>
                </Tile>
              )} />
            </View>
            {/* quick adds */}
            <View style={{ flexDirection: 'row', gap: BENTO_GAP }}>
              <Tile index={4} width={col} height={row} dashed onPress={() => router.push({ pathname: '/friends', params: { add: '1' } })} accessibilityLabel={t('bd.addTitle')}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6 }}><Icon name="tab-members" size={36} /><Text weight={800} size={15} color="link" numberOfLines={1}>{t('bd.addTitle')}</Text></View>
              </Tile>
              <Tile index={5} width={col} height={row} dashed onPress={() => setJoining(true)} accessibilityLabel={t('family.joinCode')}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6 }}><Icon name="ui-key" size={36} /><Text weight={800} size={15} color="muted" numberOfLines={1}>{t('family.joinCode')}</Text></View>
              </Tile>
            </View>
          </>
        ) : null}
      </View>
      <JoinFamilySheet visible={joining} onClose={() => setJoining(false)} />
    </Screen>
  );
}
