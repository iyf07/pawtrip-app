import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { useBuddies } from '@/api/buddies';
import { useMyDogs } from '@/api/dogs';
import { useFamily } from '@/api/family';
import { NotificationBell } from '@/components/NotificationBell';
import { Avatar, DogAvatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { PressScale } from '@/components/ui/PressScale';
import { Header, Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { BENTO_GAP, Tile, TileHeader, bentoUnits } from '@/features/circle/Bento';
import { DogAccordion } from '@/features/circle/DogAccordion';
import { PeopleRow } from '@/features/circle/PeopleRow';
import { AddFriendSheet } from '@/features/buddies/AddFriendSheet';
import { FamilyCreateSheet, FamilyInviteSheet } from '@/features/family/FamilySheets';
import { useLayout } from '@/hooks/use-layout';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';

/**
 * Circle tab, a bento box with one hero and a rhythm of tones: dogs are the hero (full-bleed accordion, big names),
 * the family is the one solid accent card, friends a pale tint. Big numerals and big names against small spaced labels;
 * no outlines, soft shadows, 18 px of air inside every card. Each card opens its page one level down.
 */
export default function Circle() {
  const { t } = useT();
  const th = useTheme();
  const dogs = useMyDogs();
  const fam = useFamily();
  const buddies = useBuddies();
  const [width, setWidth] = useState(0);
  // adding happens right here, the circle stays on screen
  const [inviting, setInviting] = useState(false);
  const [creating, setCreating] = useState(false);
  const [addingFriend, setAddingFriend] = useState(false);
  const { wide } = useLayout();
  const { col, row: phoneRow } = bentoUnits(width);
  // phone: everything stacked, full width. Wide: the dogs hero on the left, family and friends stacked on the right.
  const half = Math.max(0, (width - BENTO_GAP) / 2);
  const row = wide ? Math.round(((width - 3 * BENTO_GAP) / 4) * 0.9) : phoneRow;
  const sideW = wide ? half : col * 2 + BENTO_GAP;
  const heroW = sideW;
  const heroH = row * 2 + BENTO_GAP;
  const list = dogs.data ?? [];
  const friends = (buddies.data ?? []).filter((b) => b.status === 'accepted');
  const family = fam.data?.family ?? null;
  const members = fam.data?.members ?? [];
  const pad = { flex: 1, padding: 18, gap: 6 } as const;
  const plus = (onPress: () => void, label: string) => (
    <PressScale onPress={onPress} accessibilityRole="button" accessibilityLabel={label} hitSlop={6} style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.7)', alignItems: 'center', justifyContent: 'center' }}>
      <Text plain size={20} weight={800} style={{ color: th.onGold, lineHeight: 22 }}>+</Text>
    </PressScale>
  );

  const heroTile = (
            <Tile index={0} width={heroW} height={heroH}>
              {list.length === 0 ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: th.goldBg }}><Icon name="nav-dogs" size={96} /></View>
              ) : (
                <DogAccordion dogs={list} onOpenDog={(id) => router.push({ pathname: '/dogs/[id]', params: { id } })} />
              )}
              <View pointerEvents="box-none" style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 }}>
                  <Text weight={800} size={12} style={{ color: th.onGold, letterSpacing: 1.4, textTransform: 'uppercase' }}>{t('shell.dogs')}{list.length ? ` · ${list.length}` : ''}</Text>
                </View>
                {plus(() => router.push('/dogs/new'), t('profile.addDog'))}
              </View>
            </Tile>
  );
  const familyTile = (
            <Tile index={1} width={sideW} height={row} tone="mint" onPress={() => router.push('/family')} accessibilityLabel={t('family.tab')}>
              <View style={pad}>
                <TileHeader ink={th.onGold} title={family ? `${t('family.tab')} · ${family.name}` : t('family.tab')} addLabel={family ? t('family.invite') : t('family.createTitle')} onAdd={() => (family ? setInviting(true) : setCreating(true))} />
                {family ? (
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <PeopleRow ink={th.onGold} groups={[
                        members.map((m) => ({ key: m.userId, name: m.name, avatar: <Avatar id={m.userId} name={m.name} url={m.avatar} size={34} /> })),
                        list.map((d) => ({ key: d.id, name: d.name, avatar: <DogAvatar url={d.photo_url} size={34} /> })),
                      ]} />
                    </View>
                  </View>
                ) : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Icon name="nav-family" size={56} /></View>}
              </View>
            </Tile>
  );
  const friendsTile = (
            <Tile index={2} width={sideW} height={row} tone="tint" onPress={() => router.push('/friends')} accessibilityLabel={t('family.friends')}>
              <View style={pad}>
                <TileHeader ink={th.onGold} title={t('family.friends')} addLabel={t('bd.addTitle')} onAdd={() => setAddingFriend(true)} />
                {friends.length === 0 ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Icon name="tab-members" size={56} /></View> : (
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <PeopleRow ink={th.onGold} groups={[friends.map((b) => ({ key: b.userId, name: b.name, avatar: <Avatar id={b.userId} name={b.name} url={b.avatar} size={34} /> }))]} />
                    </View>
                  </View>
                )}
              </View>
            </Tile>
  );

  // family and friend notifications in one butter-coloured card: the newest three, tap for all (with the answers)
  const notifyH = Math.round(row * 1.2);
  const notifyTile = (
    <NotificationBell size={28} box={28} radius={14} renderTrigger={({ count, open, items }) => (
      <Tile index={3} width={width} height={notifyH} tone="butter" onPress={open} accessibilityLabel={t('notif.title')}>
        <View style={pad}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 30 }}>
            <Text weight={800} size={12} numberOfLines={1} style={{ flex: 1, color: th.onGold, letterSpacing: 1.4, textTransform: 'uppercase' }}>{t('notif.short')}</Text>
            {count > 0 ? <View style={{ minWidth: 24, height: 24, borderRadius: 12, paddingHorizontal: 7, backgroundColor: th.danger, alignItems: 'center', justifyContent: 'center' }}><Text plain weight={800} size={13} style={{ color: '#FFFFFF', lineHeight: 16 }}>{count}</Text></View> : null}
          </View>
          {items.length === 0 ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Icon name="nav-notifications" size={56} /></View> : (
            <View style={{ flex: 1, justifyContent: 'center', gap: 8 }}>
              {items.slice(0, 3).map((n) => (
                <View key={n.key} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Avatar id={n.id} name={n.name} url={n.avatar} size={28} border={0} />
                  <Text weight={700} size={13} numberOfLines={1} style={{ flex: 1, color: th.onGold }}>{n.text}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Tile>
    )} />
  );

  return (
    <Screen nav size={wide ? "wide" : "narrow"} top={<Header title={t('circle.title')} />}>
      <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)} style={{ marginTop: 8, gap: BENTO_GAP }}>
        {width > 0 ? (
          <>
            {wide ? (
              <View style={{ flexDirection: 'row', gap: BENTO_GAP, alignItems: 'flex-start' }}>
                {heroTile}
                <View style={{ gap: BENTO_GAP }}>{familyTile}{friendsTile}</View>
              </View>
            ) : <>{heroTile}{familyTile}{friendsTile}</>}
            {notifyTile}
          </>
        ) : null}
      </View>
      <FamilyInviteSheet visible={inviting} onClose={() => setInviting(false)} />
      <FamilyCreateSheet visible={creating} onClose={() => setCreating(false)} />
      <AddFriendSheet visible={addingFriend} onClose={() => setAddingFriend(false)} />
    </Screen>
  );
}
