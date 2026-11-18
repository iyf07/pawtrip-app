import * as Clipboard from 'expo-clipboard';
import { Platform, Share, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Sheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { useT } from '@/i18n';

/**
 * Our own share popup (bottom sheet on a phone, centred dialog on desktop) instead of jumping straight to the system
 * share dialog: shows what will be sent, copy the text or the link, and "more ways" opens the system share where it exists.
 */
export function ShareSheet({ visible, onClose, message, link }: { visible: boolean; onClose: () => void; message: string; link?: string }) {
  const { t } = useT();
  const toast = useToast();
  const canSystem = Platform.OS !== 'web' || (typeof navigator !== 'undefined' && !!navigator.share);

  async function copy(text: string) {
    try {
      await Clipboard.setStringAsync(text);
      toast(t('group.copied'));
      onClose();
    } catch {
      toast(t('common.saveFailed'));
    }
  }
  async function system() {
    try {
      if (Platform.OS === 'web') await navigator.share({ text: message });
      else await Share.share({ message });
      onClose();
    } catch {
      /* dismissed */
    }
  }

  return (
    <Sheet visible={visible} onClose={onClose}>
      <Text weight={800} size={22} style={{ textAlign: 'center' }}>{t('share.title')}</Text>
      <Card style={{ marginTop: 14 }}><Text selectable>{message}</Text></Card>
      <View style={{ marginTop: 14, gap: 8 }}>
        <Button label={t('share.copyText')} icon="ui-copy" block onPress={() => copy(message)} />
        {link ? <Button label={t('share.copyLink')} icon="ui-share" variant="ghost" block onPress={() => copy(link)} /> : null}
        {canSystem ? <Button label={t('share.more')} variant="ghost" block onPress={system} /> : null}
      </View>
    </Sheet>
  );
}
