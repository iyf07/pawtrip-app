import { AVATAR_COLORS } from '@/constants/theme';

/** Each dog's own soft colour (used behind a photo-less strip in the circle and as the hero of its page). */
export function dogColor(id: string) {
  const h = [...id].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
