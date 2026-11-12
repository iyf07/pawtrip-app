import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

import { supabase } from './supabase';

const BUCKET = 'photos';
const SIZE = 512; // avatars and dog photos are small squares

/**
 * Let the user pick a photo and return a local URI of a 512 px square JPEG.
 * Native shows the system crop UI (square); on the web the picture is centre-cropped.
 */
export async function pickSquarePhoto(): Promise<string | null> {
  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });
  if (res.canceled || !res.assets[0]) return null;
  const a = res.assets[0];

  const ctx = ImageManipulator.manipulate(a.uri);
  const side = Math.min(a.width, a.height);
  if (a.width > 0 && a.height > 0 && a.width !== a.height) {
    ctx.crop({ originX: Math.round((a.width - side) / 2), originY: Math.round((a.height - side) / 2), width: side, height: side });
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
