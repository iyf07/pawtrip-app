import { router } from 'expo-router';
import { Image, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMyProfile } from '@/api/profile';
import { useAuth } from '@/auth/AuthProvider';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { useInShell } from '@/components/shell/ShellContext';
import { COLUMN } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';

export const NAV_HEIGHT = 56;

/**
 * The app's top navigation bar, the same on every signed-in screen: the PawTrip logo (back to all trips)
 * on the left and your avatar (profile) on the right. Settings live on the profile page.
 */
export function NavBar() {
  const { t } = useT();
  const th = useTheme();
  const insets = useSafeAreaInsets();
  const { userId } = useAuth();
  const me = useMyProfile();
  return (
    <View style={{ width: '100%', backgroundColor: th.card, borderBottomWidth: 2, borderStyle: 'dashed', borderColor: th.line, paddingTop: insets.top }}>
      <View style={{ height: NAV_HEIGHT, width: '100%', maxWidth: COLUMN.full, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 }}>
        <Pressable onPress={() => router.navigate('/')} accessibilityRole="link" accessibilityLabel={t('trips.title')} hitSlop={8}>
          <Image source={require('../../assets/logos/wordmark-trip.png')} accessibilityLabel="Paw Trip" resizeMode="contain" style={{ height: 52, width: 81, borderRadius: 8, backgroundColor: '#FFFFFF' }} />
        </Pressable>
        <Pressable onPress={() => router.navigate('/profile')} accessibilityRole="button" accessibilityLabel={t('profile.title')} hitSlop={8}>
          <Avatar id={userId ?? 'me'} name={me.data?.display_name} url={me.data?.avatar_url} size={36} />
        </Pressable>
      </View>
    </View>
  );
}

/** Settings gear: only shown at the top right of the profile page. */
export function GearButton({ size = 40 }: { size?: number }) {
  const { t } = useT();
  const inShell = useInShell();
  const th = useTheme();
  if (inShell) return null; // settings are in the rail
  return (
    <Pressable
      onPress={() => router.push('/settings')}
      accessibilityRole="button"
      accessibilityLabel={t('trips.settings')}
      style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: th.card, borderWidth: 2, borderColor: th.line, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name="nav-settings" size={Math.round(size * 0.8)} />
    </Pressable>
  );
}
