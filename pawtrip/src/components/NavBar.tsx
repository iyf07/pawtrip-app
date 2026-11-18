import { router, usePathname } from 'expo-router';
import { useState } from 'react';
import { Animated, Image, Modal, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMyProfile } from '@/api/profile';
import { useAuth } from '@/auth/AuthProvider';
import { NotificationBell } from '@/components/NotificationBell';
import { Avatar } from '@/components/ui/Avatar';
import { Icon, type IconName } from '@/components/ui/Icon';
import { PressScale } from '@/components/ui/PressScale';
import { Text } from '@/components/ui/Text';
import { useTabGrow } from '@/components/useTabGrow';
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
  const path = usePathname();
  // the same entries as the desktop rail; settings sit next to the avatar
  const items: { key: string; icon: IconName; label: string; go: () => void; match: (p: string) => boolean }[] = [
    { key: 'cal', icon: 'tab-plan', label: t('shell.calendar'), go: () => router.navigate('/calendar'), match: (p) => p.startsWith('/calendar') },
    { key: 'trips', icon: 'nav-trips', label: t('shell.trips'), go: () => router.navigate('/'), match: (p) => p === '/' || p.startsWith('/trips') },
    {
      key: 'dogs',
      icon: 'nav-dogs',
      label: t('shell.dogs'),
      go: () => router.navigate('/dogs'),
      match: (p) => p.startsWith('/dog'),
    },
    { key: 'friends', icon: 'tab-members', label: t('shell.buddies'), go: () => router.navigate('/friends'), match: (p) => p.startsWith('/friends') || p.startsWith('/family') },
    { key: 'settings', icon: 'nav-settings', label: t('shell.settings'), go: () => router.navigate('/settings'), match: (p) => p.startsWith('/settings') },
  ];
  const btn = (it: (typeof items)[number]) => <NavButton key={it.key} icon={it.icon} label={it.label} on={it.match(path)} onPress={it.go} />;
  // everything on the left except settings and the avatar
  const left = items.filter((i) => i.key !== 'settings');
  const [menu, setMenu] = useState(false);
  const onAccount = path.startsWith('/profile') || path.startsWith('/settings');
  const menuItem = (icon: IconName, label: string, go: () => void) => (
    <Pressable key={label} onPress={() => { setMenu(false); go(); }} accessibilityRole="button" style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 16 }}>
      <Icon name={icon} size={28} />
      <Text weight={800}>{label}</Text>
    </Pressable>
  );
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
          <NotificationBell size={28} box={36} radius={12} />
          <Pressable onPress={() => setMenu(true)} accessibilityRole="button" accessibilityState={{ expanded: menu }} accessibilityLabel={t('profile.title')} hitSlop={8} style={{ marginLeft: 6 }}>
            <Avatar id={userId ?? 'me'} name={me.data?.display_name} url={me.data?.avatar_url} size={34} border={onAccount ? 3 : 2} />
          </Pressable>
        </View>
      </View>
      <Modal visible={menu} transparent animationType="fade" onRequestClose={() => setMenu(false)}>
        <Pressable onPress={() => setMenu(false)} accessibilityLabel="Close" style={{ flex: 1 }}>
          <View style={{ position: 'absolute', top: insets.top + NAV_HEIGHT - 6, right: 12, minWidth: 190, backgroundColor: th.card, borderRadius: 18, borderWidth: 2, borderColor: th.line, paddingVertical: 4, boxShadow: `0 8px 24px -6px ${th.shadow}` }}>
            {menuItem('nav-profile', t('profile.title'), () => router.navigate('/profile'))}
            {menuItem('nav-settings', t('shell.settings'), () => router.navigate('/settings'))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

/** A nav icon: the current one grows wider and scales up, the others narrow, like the tabs (0.5 s). Remembers its last
 * state across pages, because every page draws its own NavBar. */
function NavButton({ icon, label, on, onPress }: { icon: IconName; label: string; on: boolean; onPress: () => void }) {
  const th = useTheme();
  const { p, scale } = useTabGrow(on, `nav:${icon}`);
  return (
    <Animated.View style={{ width: p.interpolate({ inputRange: [0, 1], outputRange: [32, 60] }), height: 36, transform: [{ scale }] }}>
      <PressScale onPress={onPress} accessibilityRole="button" accessibilityLabel={label} hitSlop={4} style={{ flex: 1 }}>
        <Animated.View style={{ flex: 1, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: p.interpolate({ inputRange: [0, 1], outputRange: ['rgba(255,199,44,0)', th.gold] }) }}>
          <Icon name={icon} size={28} />
        </Animated.View>
      </PressScale>
    </Animated.View>
  );
}
