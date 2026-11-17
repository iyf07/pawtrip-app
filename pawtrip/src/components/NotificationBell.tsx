import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { useBuddies, useRespondBuddy, type Buddy } from '@/api/buddies';
import { useFamily, useRespondFamilyInvite } from '@/api/family';
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
  const family = useFamily();
  const respondFamily = useRespondFamilyInvite();
  const [open, setOpen] = useState(false);
  const requests = (buddies.data ?? []).filter((b) => b.status === 'pending' && b.incoming);
  const invites = family.data?.invites ?? [];
  const count = requests.length + invites.length;

  async function answer(b: Buddy, accept: boolean) {
    try {
      await respond.mutateAsync({ from: b.userId, accept });
      toast(accept ? t('bd.joined', { name: b.name }) : t('bd.declined'));
    } catch {
      toast(t('common.saveFailed'));
    }
  }

  async function answerFamily(familyId: string, name: string, accept: boolean) {
    try {
      await respondFamily.mutateAsync({ familyId, accept });
      toast(accept ? t('family.joined', { name }) : t('bd.declined'));
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
        {count > 0 ? (
          <View style={{ position: 'absolute', top: 0, right: 0, minWidth: 18, height: 18, borderRadius: 9, paddingHorizontal: 4, backgroundColor: th.danger, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: th.card }}>
            <Text plain weight={800} size={11} style={{ color: '#FFFFFF' }}>{count}</Text>
          </View>
        ) : null}
      </Pressable>
      <Sheet visible={open} onClose={() => setOpen(false)}>
        <Text weight={800} size={22} style={{ textAlign: 'center' }}>{t('notif.title')}</Text>
        <View style={{ marginTop: 12 }}>
          {count === 0 ? (
            <Text color="muted" weight={700} style={{ textAlign: 'center' }}>{t('notif.empty')}</Text>
          ) : (
            <>
            {invites.map((i) => (
              <View key={i.familyId} style={{ gap: 8, paddingVertical: 12, borderTopWidth: 1.5, borderStyle: 'dashed', borderColor: th.line }}>
                <Text weight={800} size={16}>{t('family.invitesYou', { who: i.inviterName, name: i.familyName })}</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Button label={t('family.accept')} small loading={respondFamily.isPending} onPress={() => answerFamily(i.familyId, i.familyName, true)} />
                  <Button label={t('bd.decline')} small variant="ghost" onPress={() => answerFamily(i.familyId, i.familyName, false)} />
                </View>
              </View>
            ))}
            {requests.map((b) => (
              <View key={b.userId} style={{ gap: 8, paddingVertical: 12, borderTopWidth: 1.5, borderStyle: 'dashed', borderColor: th.line }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Avatar id={b.userId} name={b.name} url={b.avatar} size={44} />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text weight={800} size={16}>{t('bd.wants', { who: b.name })}</Text>
                    <Meta size={12} numberOfLines={1}>@{b.handle}</Meta>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 8, paddingLeft: 56 }}>
                  <Button label={t('bd.accept')} small onPress={() => answer(b, true)} loading={respond.isPending} />
                  <Button label={t('bd.decline')} small variant="ghost" onPress={() => answer(b, false)} />
                </View>
              </View>
            ))}
            </>
          )}
        </View>
      </Sheet>
    </>
  );
}
