import { router, useLocalSearchParams } from 'expo-router';
import { useLayout } from '@/hooks/use-layout';
import { AddAction } from '@/components/ui/AddAction';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { useBuddies, useRemoveBuddy, useRespondBuddy, type Buddy } from '@/api/buddies';
import { PersonTraits } from '@/components/PersonTraits';
import { FriendSheet } from './FriendSheet';
import { AddFriendSheet } from './AddFriendSheet';
import { Avatar, DogAvatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { BackButton, Header, Screen } from '@/components/ui/Screen';
import { Meta, Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';
import { Reveal } from '@/components/ui/Reveal';
import { SwipeRow } from '@/components/ui/SwipeRow';
import { ConfirmSheet } from '@/components/ui/Sheet';

/** 我的伙伴: people you often travel with. Adding one needs their yes. */
export function BuddiesScreen() {
  const { t } = useT();
  const toast = useToast();
  const buddies = useBuddies();
  const [adding, setAdding] = useState(false);
  const th = useTheme();
  const { width } = useLayout();
  const { friend, add } = useLocalSearchParams<{ friend?: string; add?: string }>();
  const selected = buddies.data?.find((b) => b.userId === friend);
  const addingVisible = adding || add === '1';
  function closeAdd() { setAdding(false); if (add) router.setParams({ add: undefined }); }
  function openBuddy(b: Buddy) { router.push({ pathname: '/friends', params: { friend: b.userId } }); }
  const respond = useRespondBuddy();
  const remove = useRemoveBuddy();
  const [askRemove, setAskRemove] = useState<Buddy | null>(null);

  const all = buddies.data ?? [];
  const incoming = all.filter((b) => b.status === 'pending' && b.incoming);
  const mine = all.filter((b) => !(b.status === 'pending' && b.incoming));

  async function answer(b: Buddy, accept: boolean) {
    try {
      await respond.mutateAsync({ from: b.userId, accept });
      toast(accept ? t('bd.joined', { name: b.name }) : t('bd.declined'));
    } catch {
      toast(t('common.saveFailed'));
    }
  }

  if (friend && !selected) return (
    <Screen nav size="narrow" top={<Header title={t('bd.title')} left={<BackButton label={t('nav.back')} onPress={() => { router.setParams({ friend: undefined, add: undefined }); router.replace('/friends'); }} />} />}>
      {buddies.isPending ? <PageSkeleton cards={3} /> : <View style={{ gap: 12, marginTop: 20 }}><Text>{t('common.loadFailed')}</Text><Button label={t('common.retry')} onPress={() => buddies.refetch()} /></View>}
    </Screen>
  );

  if (friend && selected) return (
    <Screen nav size="narrow" top={<Header title={t('friend.home', { name: selected.name })} titleSize={width < 360 ? 20 : undefined} left={<BackButton label={t('nav.back')} onPress={() => { router.setParams({ friend: undefined, add: undefined }); router.replace('/friends'); }} />} />}>
      <FriendSheet buddy={selected} onClose={() => { router.setParams({ friend: undefined, add: undefined }); router.replace('/friends'); }} onRemove={(b) => remove.mutate(b.userId)} />
      <AddFriendSheet visible={addingVisible} onClose={closeAdd} />
      <ConfirmSheet visible={askRemove !== null} title={t('friend.removeConfirm')} body={t('friend.removeBody', { name: askRemove?.name ?? '' })} confirmLabel={t('bd.removeFriend')} danger
        onConfirm={() => { const b = askRemove; setAskRemove(null); if (b) remove.mutate(b.userId); }} onClose={() => setAskRemove(null)} />
    </Screen>
  );

  return (
    <Screen nav top={<Header title={t('bd.title')} left={<BackButton label={t('nav.back')} onPress={() => router.navigate('/circle')} />} right={<AddAction icon="tab-members" label={t('bd.addTitle')} onPress={() => setAdding(true)} />} />} size="narrow">
      {buddies.isPending ? (
        <PageSkeleton cards={3} />
      ) : buddies.isError && !buddies.data ? (
        <View style={{ gap: 12, marginTop: 20 }}>
          <Text>{t('common.loadFailed')}</Text>
          <Button label={t('common.retry')} onPress={() => buddies.refetch()} />
        </View>
      ) : (
        <View style={{ gap: 12, marginTop: 8 }}>
          {incoming.map((b, n) => (
            <Reveal key={b.userId} index={n}><Card>
              <Pressable onPress={() => openBuddy(b)} accessibilityRole="button" style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Avatar id={b.userId} name={b.name} url={b.avatar} size={44} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text weight={800} size={16}>
                    {t('bd.wants', { who: b.name })}
                  </Text>
                  <Meta size={12} numberOfLines={1}>@{b.handle}</Meta>
                  <PersonTraits profile={b.traits} size={12} />
                </View>
                <Text plain color="muted" size={22} weight={800}>›</Text>
              </Pressable>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                <Button label={t('bd.accept')} small onPress={() => answer(b, true)} loading={respond.isPending} />
                <Button label={t('bd.decline')} small variant="ghost" onPress={() => answer(b, false)} />
              </View>
            </Card></Reveal>
          ))}
          {all.length === 0 ? (
            <EmptyState icon="tab-members" title={t('bd.emptyTitle')} />
          ) : null}
          {mine.length > 0 ? <Card>
            {mine.map((b, i) => (
              <Reveal key={b.userId} index={incoming.length + i}><SwipeRow enabled={b.status === 'accepted'} radius={0} onTrigger={() => setAskRemove(b)}><View style={{ backgroundColor: th.card }}><Pressable
                onPress={() => openBuddy(b)}
                accessibilityRole="button"
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderTopWidth: i ? 1.5 : 0, borderStyle: 'dashed', borderColor: th.line }}>
                <Avatar id={b.userId} name={b.name} url={b.avatar} size={44} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text weight={800} size={16} numberOfLines={1}>
                    {b.name}
                  </Text>
                  <Meta size={12} numberOfLines={1}>@{b.handle}</Meta>
                  <PersonTraits profile={b.traits} size={12} />
                </View>
                {b.status === 'pending' ? <Meta weight={700}>{t('bd.pending')}</Meta> : null}
                {b.dogs.length ? (
                  <View style={{ flexDirection: 'row' }}>
                    {b.dogs.slice(0, 3).map((d, k) => (
                      <View key={d.id} style={{ marginLeft: k ? -8 : 0 }}>
                        <DogAvatar url={d.photo_url} size={28} border={2} />
                      </View>
                    ))}
                  </View>
                ) : null}
                <Text plain color="muted" size={22} weight={800}>›</Text>
              </Pressable></View></SwipeRow></Reveal>
            ))}
          </Card> : null}
          <Card dashed onPress={() => setAdding(true)} style={{ alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><Icon name="tab-members" size={28} /><Text weight={800} color="link">{t('bd.addTitle')}</Text></View>
          </Card>
        </View>
      )}
      <AddFriendSheet visible={addingVisible} onClose={closeAdd} />
    </Screen>
  );
}
