import { Image } from 'expo-image';
import { View } from 'react-native';

import { AVATAR_COLORS } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { Text } from './Text';

const hash = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

type PersonProps = { id: string; name?: string | null; url?: string | null; size?: number; border?: number };

/** Round person avatar: photo, or the first letter on a colour derived from the id. */
export function Avatar({ id, name, url, size = 32, border = 3 }: PersonProps) {
  const t = useTheme();
  const bg = AVATAR_COLORS[hash(id) % AVATAR_COLORS.length];
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bg,
        borderWidth: border,
        borderColor: t.sticker,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
      {url ? (
        <Image source={{ uri: url }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
      ) : (
        <Text weight={800} size={Math.round(size * 0.42)} style={{ color: '#4A3628' }}>
          {(name?.trim()[0] ?? '?').toUpperCase()}
        </Text>
      )}
    </View>
  );
}

export function AvatarStack({ people, max = 4, size = 32 }: { people: { id: string; name?: string | null; url?: string | null }[]; max?: number; size?: number }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {people.slice(0, max).map((p, i) => (
        <View key={p.id} style={{ marginLeft: i === 0 ? 0 : -10 }}>
          <Avatar id={p.id} name={p.name} url={p.url} size={size} />
        </View>
      ))}
    </View>
  );
}

/** Dog avatar: photo or 🐕. */
export function DogAvatar({ url, size = 44, border = 3 }: { url?: string | null; size?: number; border?: number }) {
  const t = useTheme();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: t.blueBg,
        borderWidth: border,
        borderColor: t.sticker,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
      {url ? (
        <Image source={{ uri: url }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
      ) : (
        <Text size={Math.round(size * 0.5)}>🐕</Text>
      )}
    </View>
  );
}
