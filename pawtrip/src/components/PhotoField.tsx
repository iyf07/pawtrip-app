import { useState, type ReactElement } from 'react';
import { View } from 'react-native';

import { useAuth } from '@/auth/AuthProvider';
import { PhotoCropper } from '@/components/PhotoCropper';
import { Avatar, DogAvatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Meta } from '@/components/ui/Text';
import { useT } from '@/i18n';
import { pickPhoto, renderSquare, uploadPhoto, type CropRect, type PickedPhoto } from '@/lib/photos';

/**
 * Pick -> (web) crop -> 512 px JPEG -> upload -> report the public URL.
 * `cropper` must be rendered somewhere in the screen; `choose()` starts the flow.
 */
export function usePhotoUpload(kind: 'avatar' | 'dog', onChange: (url: string) => void | Promise<void>) {
  const { t } = useT();
  const { userId } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<PickedPhoto | null>(null);

  async function finish(photo: PickedPhoto, crop?: CropRect) {
    setBusy(true);
    try {
      const local = await renderSquare(photo, crop);
      const url = await uploadPhoto(userId!, kind, local);
      await onChange(url);
    } catch {
      setError(t('dog.photoErr'));
    } finally {
      setBusy(false);
    }
  }

  async function choose() {
    setError(null);
    setBusy(true);
    try {
      const picked = await pickPhoto();
      if (!picked) return;
      if (picked.needsCrop) setPending(picked); // web: frame it first
      else await finish(picked);
    } catch {
      setError(t('dog.photoErr'));
    } finally {
      setBusy(false);
    }
  }

  const cropper: ReactElement = (
    <PhotoCropper
      photo={pending}
      onCancel={() => setPending(null)}
      onDone={(rect) => {
        const photo = pending;
        setPending(null);
        if (photo) finish(photo, rect);
      }}
    />
  );

  return { choose, busy, error, cropper };
}

type Props =
  | { kind: 'avatar'; url: string | null; name: string; onChange: (url: string | null) => void | Promise<void> }
  | { kind: 'dog'; url: string | null; onChange: (url: string | null) => void | Promise<void> };

/** Photo preview with add / change / remove. Uploads right away and reports the new public URL. */
export function PhotoField(props: Props) {
  const { t } = useT();
  const { userId } = useAuth();
  const { choose, busy, error, cropper } = usePhotoUpload(props.kind, props.onChange);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
      {props.kind === 'avatar' ? <Avatar id={userId ?? 'me'} name={props.name} url={props.url} size={72} /> : <DogAvatar url={props.url} size={72} />}
      <View style={{ flex: 1, alignItems: 'flex-start', gap: 6 }}>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <Button label={props.url ? t('dog.photoChange') : t('dog.photoAdd')} icon="ui-camera" small variant="ghost" loading={busy} onPress={choose} />
          {props.url ? <Button label={t('dog.photoRemove')} small variant="text" disabled={busy} onPress={() => props.onChange(null)} /> : null}
        </View>
        {error ? <Meta color="danger">{error}</Meta> : null}
      </View>
      {cropper}
    </View>
  );
}
