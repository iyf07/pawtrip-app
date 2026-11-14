import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Share, View } from 'react-native';

import { useRotateInviteCode, type TripDetail } from '@/api/trips';
import { Button } from '@/components/ui/Button';
import { Sheet } from '@/components/ui/Sheet';
import { Meta, Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';

const linkFor = (code: string) =>
  Platform.OS === 'web' ? `${window.location.origin}/join?code=${code}` : Linking.createURL('/join', { queryParams: { code } });

/**
 * "Invite friends" popup. The leader gets a brand-new code every time it opens (codes last one hour), so no code
 * sits on the page for everyone to see. Other members only see the current code while it is still valid.
 */
export function InviteSheet({ visible, onClose, trip, isLeader }: { visible: boolean; onClose: () => void; trip: TripDetail; isLeader: boolean }) {
  const { t } = useT();
  const th = useTheme();
  const toast = useToast();
  const rotate = useRotateInviteCode();
  const { mutate, reset, isPending, isError } = rotate;

  // a fresh code each time the leader opens the popup
  useEffect(() => {
    if (visible && isLeader) mutate(trip.id);
    if (!visible) reset();
    // only when it opens or closes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, isLeader]);

  // keep the countdown fresh
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 10_000);
    return () => clearInterval(id);
  }, []);
  const msLeft = new Date(trip.invite_expires).getTime() - now;
  const expired = msLeft <= 0;
  const minLeft = Math.max(1, Math.ceil(msLeft / 60_000));
  const waiting = isLeader && !rotate.isSuccess && !isError;
  const code = trip.invite_code;

  async function copyCode() {
    await Clipboard.setStringAsync(code);
    toast(t('group.copied'));
  }

  async function shareInvite() {
    try {
      const message = t('group.shareText', { name: trip.name, link: linkFor(code), code });
      if (Platform.OS === 'web' && !navigator.share) {
        await Clipboard.setStringAsync(message);
        toast(t('group.copied'));
      } else {
        await Share.share({ message });
      }
    } catch {
      /* dismissed */
    }
  }

  return (
    <Sheet visible={visible} onClose={onClose}>
      <Text weight={800} size={22}>
        {t('group.inviteTitle')}
      </Text>
      {isError ? (
        <Meta color="danger" style={{ marginTop: 14 }}>
          {t('common.saveFailed')}
        </Meta>
      ) : waiting || isPending ? (
        <View style={{ alignItems: 'center', paddingVertical: 36 }}>
          <ActivityIndicator color={th.muted} />
        </View>
      ) : !isLeader && expired ? (
        <Meta color="danger" style={{ marginTop: 14 }}>
          {t('group.askLeaderCode')}
        </Meta>
      ) : (
        <>
          <Meta style={{ marginTop: 14 }}>{t('group.code')}</Meta>
          <Text plain weight={800} size={30} selectable style={{ marginTop: 4, letterSpacing: 1 }}>
            {code}
          </Text>
          <Meta style={{ marginTop: 6 }}>{t('group.expiresIn', { min: minLeft })}</Meta>
          <View style={{ marginTop: 18, gap: 8 }}>
            <Button label={t('group.share')} block onPress={shareInvite} />
            <Button label={t('group.copy')} variant="ghost" block onPress={copyCode} />
          </View>
        </>
      )}
      <Button label={t('common.cancel')} variant="text" block onPress={onClose} style={{ marginTop: 10 }} />
    </Sheet>
  );
}
