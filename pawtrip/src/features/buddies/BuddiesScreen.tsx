import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { useBuddies, useFindBuddy, useRemoveBuddy, useRequestBuddy, useRespondBuddy, type Buddy, type FoundBuddy } from '@/api/buddies';
import { isCode } from '@/api/types';
import { PersonTraits } from '@/components/PersonTraits';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { Header, Screen } from '@/components/ui/Screen';
import { Meta, Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';

/** 我的伙伴: people you often travel with. Adding one needs their yes. */
export function BuddiesScreen() {
  const { t } = useT();
  const th = useTheme();
  const toast = useToast();
  const buddies = useBuddies();
  const request = useRequestBuddy();
  const find = useFindBuddy();
  const [found, setFound] = useState<FoundBuddy | null>(null);
  const respond = useRespondBuddy();
  const remove = useRemoveBuddy();
  const [handle, setHandle] = useState('');

  const all = buddies.data ?? [];
  const incoming = all.filter((b) => b.status === 'pending' && b.incoming);
  const mine = all.filter((b) => !(b.status === 'pending' && b.incoming));

  // step 1: look the ID up and show who it is; step 2: the user confirms
  async function lookup() {
    if (!handle.trim()) return;
    try {
      const res = await find.mutateAsync(handle);
      if (!res) return void toast(t('bd.unknown'));
      setFound(res);
    } catch {
      toast(t('common.saveFailed'));
    }
  }

  async function confirmAdd() {
    if (!found) return;
    try {
      await request.mutateAsync(found.handle);
      setFound(null);
      setHandle('');
      toast(found.relation === 'pending_in' ? t('bd.joined', { name: found.display_name }) : t('bd.asked'));
    } catch (e) {
      toast(isCode(e, 'self') ? t('bd.self') : t('common.saveFailed'));
    }
  }

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
                <View style={{ flex: 1 }}>
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
                <View style={{ flex: 1 }}>
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
            <View style={{ flexDirection: 'row', gap: 8, marginTop: mine.length ? 8 : 0, alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Field value={handle} onChangeText={(v) => { setHandle(v.toLowerCase()); setFound(null); }} placeholder={t('bd.idPh')} autoCapitalize="none" autoCorrect={false} onSubmitEditing={lookup} returnKeyType="search" />
              </View>
              <Button label={t('bd.find')} small onPress={lookup} loading={find.isPending} disabled={!handle.trim()} />
            </View>
            {found ? (
              <View style={{ marginTop: 12, padding: 12, borderRadius: 16, backgroundColor: th.goldBg, gap: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Avatar id={found.id} name={found.display_name} url={found.avatar_url} size={52} />
                  <View style={{ flex: 1 }}>
                    <Text weight={800} size={17} numberOfLines={1}>
                      {found.display_name}
                    </Text>
                    <Meta numberOfLines={1}>@{found.handle}</Meta>
                  </View>
                </View>
                {found.relation === 'none' || found.relation === 'pending_in' ? (
                  <Button label={found.relation === 'pending_in' ? t('bd.accept') : t('bd.confirmAdd')} block loading={request.isPending} onPress={confirmAdd} />
                ) : (
                  <Meta weight={700}>{found.relation === 'self' ? t('bd.isSelf') : found.relation === 'accepted' ? t('bd.isFriend') : t('bd.sentAlready')}</Meta>
                )}
              </View>
            ) : null}
          </Card>
        </View>
      )}
    </Screen>
  );
}
