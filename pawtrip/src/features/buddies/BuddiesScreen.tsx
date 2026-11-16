import { router, useLocalSearchParams } from 'expo-router';
import { useLayout } from '@/hooks/use-layout';
import { AddAction } from '@/components/ui/AddAction';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { useBuddies, useRemoveBuddy, useRespondBuddy, type Buddy } from '@/api/buddies';
import { FriendSheet } from './FriendSheet';
import { AddFriendSheet } from './AddFriendSheet';
import { Avatar, DogAvatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Card } from '@/components/ui/Card';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { Header, Screen } from '@/components/ui/Screen';
import { Meta, Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';

/** 我的伙伴: people you often travel with. Adding one needs their yes. */
export function BuddiesScreen() {
  const { t } = useT();
  const toast = useToast();
  const buddies = useBuddies();
  const [adding, setAdding] = useState(false);
  const [open, setOpen] = useState<Buddy | null>(null);
  const th = useTheme();
  const { wide } = useLayout();
  const { friend, add } = useLocalSearchParams<{ friend?: string; add?: string }>();
  const selected = buddies.data?.find((b) => b.userId === friend);
  const addingVisible = adding || add === '1';
  function closeAdd() { setAdding(false); if (add) router.setParams({ add: undefined }); }
  function openBuddy(b: Buddy) { if (wide) router.push({ pathname: '/friends', params: { friend: b.userId } }); else setOpen(b); }
  const respond = useRespondBuddy();
  const remove = useRemoveBuddy();

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

  if (wide && friend && selected) return (
    <Screen nav size="wide" top={<Header title={t('friend.home', { name: selected.name })} />}>
      <FriendSheet inline buddy={selected} onClose={() => { router.setParams({ friend: undefined, add: undefined }); router.replace('/friends'); }} onRemove={(b) => remove.mutate(b.userId)} />
      <AddFriendSheet visible={addingVisible} onClose={closeAdd} />
    </Screen>
  );

  return (
    <Screen nav top={<Header title={t('bd.title')} right={<AddAction label={t('bd.addTitle')} onPress={() => setAdding(true)} />} />} size="narrow">
      {buddies.isPending ? (
        <PageSkeleton cards={3} />
      ) : buddies.isError && !buddies.data ? (
        <View style={{ gap: 12, marginTop: 20 }}>
          <Text>{t('common.loadFailed')}</Text>
          <Button label={t('common.retry')} onPress={() => buddies.refetch()} />
        </View>
      ) : (
        <View style={{ gap: 14, marginTop: 8 }}>
          {incoming.map((b) => (
            <Card key={b.userId}>
              <Pressable onPress={() => openBuddy(b)} accessibilityRole="button" style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Avatar id={b.userId} name={b.name} url={b.avatar} size={44} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text weight={800} size={16}>
                    {t('bd.wants', { who: b.name })}
                  </Text>
                  <Meta size={12} numberOfLines={1}>@{b.handle}</Meta>
                </View>
                <Text plain color="muted" size={22} weight={800}>›</Text>
              </Pressable>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                <Button label={t('bd.accept')} small onPress={() => answer(b, true)} loading={respond.isPending} />
                <Button label={t('bd.decline')} small variant="ghost" onPress={() => answer(b, false)} />
              </View>
            </Card>
          ))}
          {all.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 40, gap: 18 }}>
              <Icon name="tab-members" size={88} />
              <Text weight={800} size={20}>{t('bd.emptyTitle')}</Text>
            </View>
          ) : null}
          {mine.length > 0 ? <Card>
            {mine.map((b, i) => (
              <Pressable
                key={b.userId}
                onPress={() => openBuddy(b)}
                accessibilityRole="button"
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderTopWidth: i ? 1.5 : 0, borderStyle: 'dashed', borderColor: th.line }}>
                <Avatar id={b.userId} name={b.name} url={b.avatar} size={44} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text weight={800} size={16} numberOfLines={1}>
                    {b.name}
                  </Text>
                  <Meta size={12} numberOfLines={1}>@{b.handle}</Meta>
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
              </Pressable>
            ))}
          </Card> : null}
          <Card dashed onPress={() => setAdding(true)} style={{ alignItems: 'center' }}>
            <Text weight={800} color="link">
              {'+ ' + t('bd.addTitle')}
            </Text>
          </Card>
        </View>
      )}
      <AddFriendSheet visible={addingVisible} onClose={closeAdd} />
      <FriendSheet buddy={open} onClose={() => setOpen(null)} onRemove={(b) => remove.mutate(b.userId)} />
    </Screen>
  );
}
