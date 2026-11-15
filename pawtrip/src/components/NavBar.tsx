import { router, usePathname } from 'expo-router';
import { Image, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMyDogs } from '@/api/dogs';
import { useMyProfile } from '@/api/profile';
import { useAuth } from '@/auth/AuthProvider';
import { Avatar } from '@/components/ui/Avatar';
import { Icon, type IconName } from '@/components/ui/Icon';
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
  const dogs = useMyDogs();
  const path = usePathname();
  // the same entries as the desktop rail; settings sit next to the avatar
  const items: { key: string; icon: IconName; label: string; go: () => void; match: (p: string) => boolean }[] = [
    { key: 'cal', icon: 'tab-plan', label: t('shell.calendar'), go: () => router.navigate('/calendar'), match: (p) => p.startsWith('/calendar') },
    { key: 'trips', icon: 'nav-trips', label: t('shell.trips'), go: () => router.navigate('/'), match: (p) => p === '/' || p.startsWith('/trip') },
    {
      key: 'dogs',
      icon: 'nav-dogs',
      label: t('shell.dogs'),
      go: () => {
        const first = dogs.data?.[0];
        router.navigate({ pathname: '/dog/[id]', params: { id: first?.id ?? 'new' } });
      },
      match: (p) => p.startsWith('/dog'),
    },
    { key: 'friends', icon: 'tab-members', label: t('shell.buddies'), go: () => router.navigate('/buddies'), match: (p) => p.startsWith('/buddies') },
    { key: 'settings', icon: 'nav-settings', label: t('shell.settings'), go: () => router.navigate('/settings'), match: (p) => p.startsWith('/settings') },
  ];
  const btn = (it: (typeof items)[number]) => (
    <Pressable key={it.key} onPress={it.go} accessibilityRole="button" accessibilityLabel={it.label} hitSlop={4} style={{ width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: it.match(path) ? th.gold : 'transparent' }}>
      <Icon name={it.icon} size={28} />
    </Pressable>
  );
  // everything on the left except settings and the avatar
  const left = items.filter((i) => i.key !== 'settings');
  const right = items.filter((i) => i.key === 'settings');
  return (
    <View style={{ width: '100%', backgroundColor: th.card, borderBottomWidth: 2, borderStyle: 'dashed', borderColor: th.line, paddingTop: insets.top }}>
      <View style={{ height: NAV_HEIGHT, width: '100%', maxWidth: COLUMN.full, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
          <Pressable onPress={() => router.navigate('/')} accessibilityRole="link" accessibilityLabel={t('trips.title')} hitSlop={8} style={{ marginRight: 4 }}>
            <Image source={require('../../assets/logos/wordmark-trip.png')} accessibilityLabel="Paw Trip" resizeMode="contain" style={{ height: 46, width: 72, borderRadius: 8, backgroundColor: '#FFFFFF' }} />
          </Pressable>
          {left.map(btn)}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
          {right.map(btn)}
          <Pressable onPress={() => router.navigate('/profile')} accessibilityRole="button" accessibilityLabel={t('profile.title')} hitSlop={8} style={{ marginLeft: 6 }}>
            <Avatar id={userId ?? 'me'} name={me.data?.display_name} url={me.data?.avatar_url} size={34} border={path.startsWith('/profile') ? 3 : 2} />
          </Pressable>
        </View>
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
