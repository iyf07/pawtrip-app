import * as Clipboard from 'expo-clipboard';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { peekFamily, useJoinFamily, useRotateFamilyCode, type FamilyPreview } from '@/api/family';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Sheet } from '@/components/ui/Sheet';
import { Meta, Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';
import { ShareSheet } from '@/components/ShareSheet';

/** Join a family with an invite code: type the code, see which family it is, confirm. */
export function JoinFamilySheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { t } = useT();
  const toast = useToast();
  const join = useJoinFamily();
  const [code, setCode] = useState('');
  const [preview, setPreview] = useState<FamilyPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const clean = code.trim().toLowerCase();

  function close() {
    setCode('');
    setPreview(null);
    setError(null);
    onClose();
  }

  async function find() {
    if (!clean) return setError(t('family.codeEmpty'));
    setError(null);
    setBusy(true);
    try {
      const p = await peekFamily(clean);
      if (!p) setError(t('family.codeNone'));
      else if (p.expired) setError(t('family.codeExpired'));
      else if (p.already_in_family) setError(t('family.inOther'));
      else setPreview(p);
    } catch {
      setError(t('family.codeNet'));
    } finally {
      setBusy(false);
    }
  }

  async function confirm() {
    try {
      await join.mutateAsync(clean);
      toast(t('family.joined', { name: preview?.name ?? '' }));
      close();
    } catch {
      setError(t('family.codeExpired'));
      setPreview(null);
    }
  }

  return (
    <Sheet visible={visible} onClose={close}>
      <Text weight={800} size={22} style={{ textAlign: 'center' }}>{t('family.joinCode')}</Text>
      {preview ? (
        <View style={{ marginTop: 16, gap: 12 }}>
          <Text weight={800} size={18} style={{ textAlign: 'center' }}>{t('family.joinOne', { name: preview.name, n: preview.members })}</Text>
          <Button label={t('family.accept')} block loading={join.isPending} onPress={confirm} />
        </View>
      ) : (
        <>
          <Field value={code} onChangeText={(v) => { setCode(v); setError(null); }} placeholder={t('family.codePh')} autoCapitalize="none" autoCorrect={false} autoFocus error={error ?? undefined} />
          <Button label={t('family.findCode')} block loading={busy} disabled={!clean} onPress={find} style={{ marginTop: 12 }} />
        </>
      )}
    </Sheet>
  );
}

/** Admin: a brand-new one-hour code every time this opens, with share and copy. */
export function FamilyCodeSheet({ visible, onClose, familyName }: { visible: boolean; onClose: () => void; familyName: string }) {
  const { t } = useT();
  const th = useTheme();
  const toast = useToast();
  const rotate = useRotateFamilyCode();
  const { mutate, reset } = rotate;
  const [now] = useState(() => Date.now());

  useEffect(() => {
    if (visible) mutate();
    else reset();
    // only when it opens or closes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const data = rotate.data;
  const minLeft = data ? Math.min(60, Math.max(1, Math.ceil((new Date(data.expires).getTime() - now) / 60_000))) : 60;

  async function copy() {
    if (!data) return;
    await Clipboard.setStringAsync(data.code);
    toast(t('family.codeCopied'));
  }

  const [sharing, setSharing] = useState(false);

  return (
    <Sheet visible={visible} onClose={onClose}>
      <Text weight={800} size={22} style={{ textAlign: 'center' }}>{t('family.codeTitle')}</Text>
      {rotate.isError ? (
        <Meta color="danger" style={{ marginTop: 14, textAlign: 'center' }}>{t('common.saveFailed')}</Meta>
      ) : !data ? (
        <View style={{ alignItems: 'center', paddingVertical: 36 }}><ActivityIndicator color={th.muted} /></View>
      ) : (
        <View style={{ alignItems: 'center', marginTop: 8 }}>
          <Text plain weight={800} size={30} selectable style={{ marginTop: 4, letterSpacing: 1 }}>{data.code}</Text>
          <Meta style={{ marginTop: 6 }}>{t('family.codeExpires', { min: minLeft })}</Meta>
          <View style={{ marginTop: 18, gap: 8, alignSelf: 'stretch' }}>
            <Button label={t('family.share')} icon="ui-share" block onPress={() => setSharing(true)} />
            <Button label={t('family.copy')} icon="ui-copy" variant="ghost" block onPress={copy} />
          </View>
        </View>
      )}
      {data ? <ShareSheet visible={sharing} onClose={() => setSharing(false)} message={t('family.shareText', { name: familyName, code: data.code })} /> : null}
    </Sheet>
  );
}
