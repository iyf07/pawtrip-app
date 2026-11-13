import { useEffect, useState, type ReactNode } from 'react';
import { Animated, Easing, Modal, Platform, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MAX_WIDTH } from '@/constants/theme';
import { useLayout } from '@/hooks/use-layout';
import { useT } from '@/i18n';
import { useTheme } from '@/hooks/use-theme';

import { Button } from './Button';
import { Text } from './Text';

type SheetProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  /** pinned below the scrolling content (e.g. a save bar) */
  footer?: ReactNode;
  /** a tall form: nearly full height on a phone */
  tall?: boolean;
};

/**
 * Popup over a scrim: bottom sheet on a phone, centred dialog on tablet/desktop.
 * The scrim fades in on its own while the panel eases up a little and fades in (no whole-screen slide, which made the
 * dark layer sweep up as a hard line); closing plays the same animation backwards before the popup unmounts.
 */
export function Sheet({ visible, onClose, children, footer, tall }: SheetProps) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { medium } = useLayout();
  const [mounted, setMounted] = useState(visible);
  const [progress] = useState(() => new Animated.Value(visible ? 1 : 0));
  const native = Platform.OS !== 'web';

  if (visible && !mounted) setMounted(true); // mount first, animate in on the next frame

  useEffect(() => {
    if (visible) {
      Animated.timing(progress, { toValue: 1, duration: 280, easing: Easing.out(Easing.cubic), useNativeDriver: native }).start();
    } else {
      Animated.timing(progress, { toValue: 0, duration: 200, easing: Easing.in(Easing.cubic), useNativeDriver: native }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [visible, progress, native]);

  if (!mounted) return null;

  const scrimOpacity = progress.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const panelOpacity = progress.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0, 0.9, 1] });
  const lift = progress.interpolate({ inputRange: [0, 1], outputRange: [medium ? 14 : 48, 0] });
  const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [medium ? 0.97 : 1, 1] });

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View style={{ flex: 1, justifyContent: medium ? 'center' : 'flex-end', paddingHorizontal: medium ? 24 : 0 }}>
        <Animated.View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: t.scrim, opacity: scrimOpacity }} />
        <Pressable onPress={onClose} accessibilityLabel="Close" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        <Animated.View
          style={{
            width: '100%',
            maxWidth: MAX_WIDTH,
            alignSelf: 'center',
            maxHeight: medium ? '90%' : tall ? '94%' : '88%',
            opacity: panelOpacity,
            transform: [{ translateY: lift }, { scale }],
          }}>
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              overflow: 'hidden',
              backgroundColor: t.bg,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              borderBottomLeftRadius: medium ? 24 : 0,
              borderBottomRightRadius: medium ? 24 : 0,
              paddingTop: 10,
              maxHeight: '100%',
            }}>
            <View style={{ width: 44, height: 5, borderRadius: 3, backgroundColor: t.line, alignSelf: 'center', marginBottom: 14 }} />
            <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: footer ? 16 : 22 + insets.bottom }} keyboardShouldPersistTaps="handled">
              {children}
            </ScrollView>
            {footer}
          </Pressable>
        </Animated.View>
      </View>
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
