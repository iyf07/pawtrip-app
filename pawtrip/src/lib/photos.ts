import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

import { supabase } from './supabase';

const BUCKET = 'photos';
const SIZE = 512; // avatars and dog photos are small squares

export type PickedPhoto = {
  uri: string;
  width: number;
  height: number;
  /** web: the user still has to frame the picture (native already cropped it in the system picker) */
  needsCrop: boolean;
};

/** A square region of the source image, in source pixels. */
export type CropRect = { x: number; y: number; size: number };

/** Let the user pick a photo. Native shows the system square-crop UI; on the web our own cropper follows. */
export async function pickPhoto(): Promise<PickedPhoto | null> {
  const isWeb = Platform.OS === 'web';
  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: !isWeb,
    aspect: [1, 1],
    quality: 1,
  });
  if (res.canceled || !res.assets[0]) return null;
  const a = res.assets[0];
  return { uri: a.uri, width: a.width, height: a.height, needsCrop: isWeb };
}

/** Crop to the given square (centre square by default) and shrink to a 512 px JPEG. Returns a local URI. */
export async function renderSquare(photo: Pick<PickedPhoto, 'uri' | 'width' | 'height'>, crop?: CropRect): Promise<string> {
  const { width: w, height: h } = photo;
  const ctx = ImageManipulator.manipulate(photo.uri);
  let side = Math.min(w, h);
  if (crop) {
    side = Math.max(1, Math.round(crop.size));
    const x = Math.min(Math.max(0, Math.round(crop.x)), Math.max(0, w - side));
    const y = Math.min(Math.max(0, Math.round(crop.y)), Math.max(0, h - side));
    ctx.crop({ originX: x, originY: y, width: side, height: side });
  } else if (w > 0 && h > 0 && w !== h) {
    ctx.crop({ originX: Math.round((w - side) / 2), originY: Math.round((h - side) / 2), width: side, height: side });
  }
  ctx.resize({ width: side > 0 ? Math.min(SIZE, side) : SIZE });
  const rendered = await ctx.renderAsync();
  const out = await rendered.saveAsync({ format: SaveFormat.JPEG, compress: 0.85 });
  return out.uri;
}

/** Upload to the user's own folder in the public `photos` bucket and return the public URL. */
export async function uploadPhoto(userId: string, kind: 'avatar' | 'dog', localUri: string): Promise<string> {
  const bytes = await (await fetch(localUri)).arrayBuffer();
  const path = `${userId}/${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, bytes, { contentType: 'image/jpeg', upsert: false });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Best-effort cleanup of a photo that is no longer used. Ignores URLs that are not ours. */
export async function deletePhotoByUrl(url: string | null | undefined) {
  if (!url) return;
  const marker = `/object/public/${BUCKET}/`;
  const i = url.indexOf(marker);
  if (i < 0) return;
  await supabase.storage.from(BUCKET).remove([decodeURIComponent(url.slice(i + marker.length))]).catch(() => {});
}
