import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { useBuddies, useRespondBuddy, type Buddy } from '@/api/buddies';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Sheet } from '@/components/ui/Sheet';
import { Meta, Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';

/** Notifications above settings in the nav. For now: friend requests waiting for my answer. */
export function NotificationBell({ size, box, radius }: { size: number; box: number; radius: number }) {
  const { t } = useT();
  const th = useTheme();
  const toast = useToast();
  const buddies = useBuddies();
  const respond = useRespondBuddy();
  const [open, setOpen] = useState(false);
  const requests = (buddies.data ?? []).filter((b) => b.status === 'pending' && b.incoming);

  async function answer(b: Buddy, accept: boolean) {
    try {
      await respond.mutateAsync({ from: b.userId, accept });
      toast(accept ? t('bd.joined', { name: b.name }) : t('bd.declined'));
    } catch {
      toast(t('common.saveFailed'));
    }
  }

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={t('notif.title')}
        hitSlop={4}
        style={{ width: box, height: box, borderRadius: radius, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="nav-notifications" size={size} />
        {requests.length > 0 ? (
          <View style={{ position: 'absolute', top: 0, right: 0, minWidth: 18, height: 18, borderRadius: 9, paddingHorizontal: 4, backgroundColor: th.danger, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: th.card }}>
            <Text plain weight={800} size={11} style={{ color: '#FFFFFF' }}>{requests.length}</Text>
          </View>
        ) : null}
      </Pressable>
      <Sheet visible={open} onClose={() => setOpen(false)}>
        <Text weight={800} size={22}>{t('notif.title')}</Text>
        <View style={{ gap: 14, marginTop: 16 }}>
          {requests.length === 0 ? (
            <Text color="muted" weight={700}>{t('notif.empty')}</Text>
          ) : (
            requests.map((b) => (
              <View key={b.userId} style={{ gap: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Avatar id={b.userId} name={b.name} url={b.avatar} size={44} />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text weight={800} size={16}>{t('bd.wants', { who: b.name })}</Text>
                    <Meta size={12} numberOfLines={1}>@{b.handle}</Meta>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Button label={t('bd.accept')} small onPress={() => answer(b, true)} loading={respond.isPending} />
                  <Button label={t('bd.decline')} small variant="ghost" onPress={() => answer(b, false)} />
                </View>
              </View>
            ))
          )}
        </View>
      </Sheet>
    </>
  );
}
