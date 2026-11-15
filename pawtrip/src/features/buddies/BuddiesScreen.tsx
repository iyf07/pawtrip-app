import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { useBuddies, useRemoveBuddy, useRespondBuddy, type Buddy } from '@/api/buddies';
import { AddFriendSheet } from './AddFriendSheet';
import { PersonTraits } from '@/components/PersonTraits';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { Header, Screen } from '@/components/ui/Screen';
import { Meta, Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { useT } from '@/i18n';

/** 我的伙伴: people you often travel with. Adding one needs their yes. */
export function BuddiesScreen() {
  const { t } = useT();
  const toast = useToast();
  const buddies = useBuddies();
  const [adding, setAdding] = useState(false);
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

  return (
    <Screen nav top={<Header title={t('bd.title')} />} size="narrow">
      {buddies.isPending ? (
        <PageSkeleton cards={3} />
      ) : (
        <View style={{ gap: 14, marginTop: 8 }}>
          {incoming.map((b) => (
            <Card key={b.userId}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Avatar id={b.userId} name={b.name} url={b.avatar} size={40} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text weight={800} size={15}>
                    {t('bd.wants', { who: b.name })}
                  </Text>
                  <Meta numberOfLines={1}>@{b.handle}</Meta>
                  <PersonTraits profile={b.traits} />
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                <Button label={t('bd.accept')} small onPress={() => answer(b, true)} loading={respond.isPending} />
                <Button label={t('bd.decline')} small variant="ghost" onPress={() => answer(b, false)} />
              </View>
            </Card>
          ))}
          <Card>
            {mine.map((b) => (
              <View key={b.userId} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 7 }}>
                <Avatar id={b.userId} name={b.name} url={b.avatar} size={38} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text weight={800} size={15} numberOfLines={1}>
                    {b.name}
                  </Text>
                  <Meta numberOfLines={1}>@{b.handle}</Meta>
                  <PersonTraits profile={b.traits} />
                </View>
                {b.status === 'pending' ? <Meta weight={700}>{t('bd.pending')}</Meta> : null}
                <Pressable onPress={() => remove.mutate(b.userId)} accessibilityRole="button" accessibilityLabel={t('bd.remove')} hitSlop={8}>
                  <Text plain weight={800} size={18} color="muted">
                    ×
                  </Text>
                </Pressable>
              </View>
            ))}
          </Card>
          <Card dashed onPress={() => setAdding(true)} style={{ alignItems: 'center' }}>
            <Text weight={800} color="link">
              {'+ ' + t('bd.addTitle')}
            </Text>
          </Card>
        </View>
      )}
      <AddFriendSheet visible={adding} onClose={() => setAdding(false)} />
    </Screen>
  );
}
