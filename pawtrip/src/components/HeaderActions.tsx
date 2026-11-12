import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { useMyProfile } from '@/api/profile';
import { useAuth } from '@/auth/AuthProvider';
import { Avatar } from '@/components/ui/Avatar';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';

type Props = {
  /** show the avatar (profile) button; the profile page itself only shows the gear */
  avatar?: boolean;
  size?: number;
  /** extra buttons rendered before the gear (e.g. "new trip" on the home screen) */
  before?: React.ReactNode;
};

/** Top-right actions shared by the home, trip and profile screens: [ ... ] [settings] [avatar]. */
export function HeaderActions({ avatar = true, size = 40, before }: Props) {
  const { t } = useT();
  const th = useTheme();
  const { userId } = useAuth();
  const me = useMyProfile();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      {before}
      <Pressable
        onPress={() => router.push('/settings')}
        accessibilityRole="button"
        accessibilityLabel={t('trips.settings')}
        style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: th.card, borderWidth: 2, borderColor: th.line, alignItems: 'center', justifyContent: 'center' }}>
        <Text size={size * 0.45} style={{ lineHeight: size * 0.55 }}>⚙️</Text>
      </Pressable>
      {avatar ? (
        <Pressable onPress={() => router.push('/profile')} accessibilityRole="button" accessibilityLabel={t('profile.title')}>
          <Avatar id={userId ?? 'me'} name={me.data?.display_name} url={me.data?.avatar_url} size={size} />
        </Pressable>
      ) : null}
    </View>
  );
}
