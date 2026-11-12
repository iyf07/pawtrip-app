import type { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MAX_WIDTH } from '@/constants/theme';
import { useLayout } from '@/hooks/use-layout';
import { useT } from '@/i18n';
import { useTheme } from '@/hooks/use-theme';

import { Button } from './Button';
import { Text } from './Text';

type SheetProps = { visible: boolean; onClose: () => void; children: ReactNode };

/** Bottom sheet over a scrim. */
export function Sheet({ visible, onClose, children }: SheetProps) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { medium } = useLayout();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: t.scrim, justifyContent: medium ? 'center' : 'flex-end', paddingHorizontal: medium ? 24 : 0 }} accessibilityLabel="Close">
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: MAX_WIDTH,
            alignSelf: 'center',
            maxHeight: medium ? '90%' : '88%',
            backgroundColor: t.bg,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderBottomLeftRadius: medium ? 24 : 0,
            borderBottomRightRadius: medium ? 24 : 0,
            paddingTop: 10,
          }}>
          <View style={{ width: 44, height: 5, borderRadius: 3, backgroundColor: t.line, alignSelf: 'center', marginBottom: 14 }} />
          <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 22 + insets.bottom }} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

type ConfirmProps = {
  visible: boolean;
  title: string;
  body?: string;
  confirmLabel: string;
  /** red confirm button for destructive actions */
  danger?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmSheet({ visible, title, body, confirmLabel, danger, busy, onConfirm, onClose }: ConfirmProps) {
  const { t } = useT();
  return (
    <Sheet visible={visible} onClose={onClose}>
      <Text weight={800} size={20}>
        {title}
      </Text>
      {body ? <Text style={{ marginTop: 8 }}>{body}</Text> : null}
      <View style={{ marginTop: 16, gap: 8 }}>
        <Button label={confirmLabel} variant={danger ? 'danger' : 'gold'} block loading={busy} onPress={onConfirm} />
        <Button label={t('common.cancel')} variant="text" block onPress={onClose} />
      </View>
    </Sheet>
  );
}
