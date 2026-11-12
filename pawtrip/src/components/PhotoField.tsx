import { useState } from 'react';
import { View } from 'react-native';

import { useAuth } from '@/auth/AuthProvider';
import { Avatar, DogAvatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Meta } from '@/components/ui/Text';
import { useT } from '@/i18n';
import { pickSquarePhoto, uploadPhoto } from '@/lib/photos';

type Props =
  | { kind: 'avatar'; url: string | null; name: string; onChange: (url: string | null) => void | Promise<void> }
  | { kind: 'dog'; url: string | null; onChange: (url: string | null) => void | Promise<void> };

/** Photo preview with add / change / remove. Uploads right away and reports the new public URL. */
export function PhotoField(props: Props) {
  const { t } = useT();
  const { userId } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function choose() {
    setError(null);
    setBusy(true);
    try {
      const local = await pickSquarePhoto();
      if (!local) return;
      const url = await uploadPhoto(userId!, props.kind, local);
      await props.onChange(url);
    } catch {
      setError(t('dog.photoErr'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
      {props.kind === 'avatar' ? <Avatar id={userId ?? 'me'} name={props.name} url={props.url} size={72} /> : <DogAvatar url={props.url} size={72} />}
      <View style={{ flex: 1, alignItems: 'flex-start', gap: 6 }}>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <Button label={props.url ? t('dog.photoChange') : t('dog.photoAdd')} small variant="ghost" loading={busy} onPress={choose} />
          {props.url ? <Button label={t('dog.photoRemove')} small variant="text" disabled={busy} onPress={() => props.onChange(null)} /> : null}
        </View>
        {error ? <Meta color="danger">{error}</Meta> : null}
      </View>
    </View>
  );
}
