import { useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';

import { useBuddies, useRemoveBuddy, useRequestBuddy, useRespondBuddy, type Buddy } from '@/api/buddies';
import { isCode } from '@/api/types';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
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
  const respond = useRespondBuddy();
  const remove = useRemoveBuddy();
  const [handle, setHandle] = useState('');

  const all = buddies.data ?? [];
  const incoming = all.filter((b) => b.status === 'pending' && b.incoming);
  const mine = all.filter((b) => !(b.status === 'pending' && b.incoming));

  async function add() {
    if (!handle.trim()) return;
    try {
      await request.mutateAsync(handle);
      setHandle('');
      toast(t('bd.asked'));
    } catch (e) {
      toast(isCode(e, 'unknown_handle') ? t('bd.unknown') : isCode(e, 'self') ? t('bd.self') : t('common.saveFailed'));
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
    <Screen nav top={<Header title={t('bd.title')} />} size="wide">
      {buddies.isPending ? (
        <View style={{ alignItems: 'center', paddingTop: 60 }}>
          <ActivityIndicator color={th.muted} />
        </View>
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
                <Field value={handle} onChangeText={(v) => setHandle(v.toLowerCase())} placeholder={t('bd.idPh')} autoCapitalize="none" autoCorrect={false} onSubmitEditing={add} returnKeyType="send" />
              </View>
              <Button label={t('bd.add')} small onPress={add} loading={request.isPending} disabled={!handle.trim()} />
            </View>
          </Card>
        </View>
      )}
    </Screen>
  );
}
