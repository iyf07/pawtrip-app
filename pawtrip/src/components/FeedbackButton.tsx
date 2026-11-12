import { usePathname } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSubmitFeedback, type FeedbackKind } from '@/api/feedback';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Field } from '@/components/ui/Field';
import { Sheet } from '@/components/ui/Sheet';
import { Meta, Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { MAX_WIDTH } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useT, type Key } from '@/i18n';
import { pickScreenshot } from '@/lib/photos';

const KINDS: FeedbackKind[] = ['bug', 'idea', 'other'];

/** A small 💬 at the right edge of every screen (signed-in users). Opens a quick feedback form that records where the user was. */
export function FeedbackButton() {
  const { t } = useT();
  const th = useTheme();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <View pointerEvents="box-none" style={{ position: 'absolute', left: 0, right: 0, bottom: insets.bottom + 96, alignItems: 'center' }}>
        <View pointerEvents="box-none" style={{ width: '100%', maxWidth: MAX_WIDTH, alignItems: 'flex-end' }}>
          <Pressable
            onPress={() => setOpen(true)}
            accessibilityRole="button"
            accessibilityLabel={t('fdbk.button')}
            style={{
              marginRight: 6,
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: th.card,
              borderWidth: 2,
              borderColor: th.line,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.92,
              boxShadow: `0 3px 8px -2px ${th.shadow}`,
            }}>
            <Text size={16} style={{ lineHeight: 20 }}>
              💬
            </Text>
          </Pressable>
        </View>
      </View>
      <Sheet visible={open} onClose={() => setOpen(false)}>
        {open ? <FeedbackForm route={pathname} onClose={() => setOpen(false)} /> : null}
      </Sheet>
    </>
  );
}

function FeedbackForm({ route, onClose }: { route: string; onClose: () => void }) {
  const { t, lang } = useT();
  const toast = useToast();
  const submit = useSubmitFeedback();
  const [kind, setKind] = useState<FeedbackKind>('bug');
  const [message, setMessage] = useState('');
  const [shot, setShot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    setError(null);
    try {
      await submit.mutateAsync({ kind, message, route, lang, screenshotUri: shot });
      toast(t('fdbk.sent'));
      onClose();
    } catch (e) {
      const m = e instanceof Error ? e.message : String((e as { message?: string })?.message ?? '');
      setError(m.includes('rate_limited') ? t('fdbk.errRate') : t('fdbk.errSend'));
    }
  }

  return (
    <View>
      <Text weight={800} size={22}>
        {t('fdbk.title')}
      </Text>
      <Meta style={{ marginTop: 4 }}>{t('fdbk.hint')}</Meta>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
        {KINDS.map((k) => (
          <Chip key={k} label={t(`fdbk.kind.${k}` as Key)} on={kind === k} onPress={() => setKind(k)} />
        ))}
      </View>

      <Field
        value={message}
        onChangeText={setMessage}
        placeholder={t('fdbk.msg')}
        multiline
        maxLength={2000}
        autoFocus
        style={{ minHeight: 110, textAlignVertical: 'top' }}
      />

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        <Button
          label={shot ? t('fdbk.attached') : t('fdbk.attach')}
          small
          variant="ghost"
          onPress={async () => {
            try {
              const uri = await pickScreenshot();
              if (uri) setShot(uri);
            } catch {
              setError(t('fdbk.errSend'));
            }
          }}
        />
        {shot ? <Button label={t('fdbk.remove')} small variant="text" onPress={() => setShot(null)} /> : null}
      </View>

      <Meta style={{ marginTop: 12 }}>{t('fdbk.context')}</Meta>
      {error ? (
        <Text size={14} weight={700} color="danger" style={{ marginTop: 8 }}>
          {error}
        </Text>
      ) : null}
      <Button label={t('fdbk.send')} block loading={submit.isPending} disabled={message.trim().length === 0} onPress={send} style={{ marginTop: 14 }} />
    </View>
  );
}
