import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/nunito';
import { Fredoka_700Bold } from '@expo-google-fonts/fredoka';
import { ZCOOLKuaiLe_400Regular } from '@expo-google-fonts/zcool-kuaile';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import Head from 'expo-router/head';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useBuddies } from '@/api/buddies';
import { useMyDogs } from '@/api/dogs';
import { useMyProfile, useSettings } from '@/api/profile';
import { usePrefetchTrips, useTrips } from '@/api/trips';
import { preloadIcons } from '@/components/ui/Icon';
import { AuthProvider, useAuth } from '@/auth/AuthProvider';
import { FeedbackButton } from '@/components/FeedbackButton';
import { DesktopShell } from '@/components/shell/DesktopShell';
import { ToastProvider } from '@/components/ui/Toast';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { PrefsProvider } from '@/hooks/use-prefs';
import { I18nProvider } from '@/i18n';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold });
  // playful title fonts (Latin + Chinese); loaded in the background, the page shows without waiting for them
  useFonts({ Fredoka_700Bold, ZCOOLKuaiLe_400Regular });
  const [client] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 15_000, retry: 1, refetchOnWindowFocus: true } } }),
  );

  return (
    <QueryClientProvider client={client}>
      <Head>
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Paw Trip" />
        <meta property="og:title" content="Paw Trip" />
        <meta property="og:description" content="Plan dog-friendly group trips together." />
        <meta property="og:image" content="https://pawtrip.expo.app/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://pawtrip.expo.app/og-image.png" />
      </Head>
      <I18nProvider>
        <SafeAreaProvider>
          <AuthProvider>
            <PrefsProvider>
              <ToastProvider>
                <Gate fontsLoaded={fontsLoaded} />
              </ToastProvider>
            </PrefsProvider>
          </AuthProvider>
        </SafeAreaProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}

/** Routes: signed-out users only see /sign-in, signed-in users only see the app. */
function Gate({ fontsLoaded }: { fontsLoaded: boolean }) {
  const { session, ready } = useAuth();
  const me = useMyProfile();
  // warm the data and the icons every screen needs, so opening a screen for the first time does not flash empty
  useMyDogs();
  useBuddies();
  useSettings();
  const trips = useTrips();
  usePrefetchTrips((trips.data ?? []).map((x) => x.id)); // trip details and their items, so opening a trip shows content at once
  useEffect(() => {
    if (!session) return;
    void preloadIcons();
    // the map library is a big separate download; fetch it quietly so the first map opens at once
    const id = setTimeout(() => {
      if (Platform.OS === 'web') void import('mapbox-gl').catch(() => {});
    }, 2500);
    return () => clearTimeout(id);
  }, [session]);
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;

  useEffect(() => {
    if (fontsLoaded && ready) SplashScreen.hideAsync();
  }, [fontsLoaded, ready]);

  // wait for the profile too, so a new user lands on onboarding instead of flashing the app
  if (!fontsLoaded || !ready || (!!session && me.isPending)) return null;
  const needsOnboarding = !!session && !!me.data && !me.data.onboarded_at;

  return (
    <ThemeProvider value={{ ...base, colors: { ...base.colors, background: colors.bg, card: colors.bg, text: colors.text, border: colors.line } }}>
      <DesktopShell enabled={!!session && !needsOnboarding}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Protected guard={!session}>
          <Stack.Screen name="sign-in" />
        </Stack.Protected>
        <Stack.Protected guard={needsOnboarding}>
          <Stack.Screen name="onboarding" />
        </Stack.Protected>
        <Stack.Protected guard={!!session && !needsOnboarding}>
          <Stack.Screen name="index" />
          <Stack.Screen name="calendar" />
          <Stack.Screen name="friends" />
          <Stack.Screen name="dogs/index" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="trips/new" options={{ presentation: 'modal' }} />
          <Stack.Screen name="join" options={{ presentation: 'modal' }} />
          <Stack.Screen name="profile" />
          <Stack.Screen name="dogs/[id]" options={{ presentation: 'modal' }} />
          <Stack.Screen name="trips/[id]" />
        </Stack.Protected>
      </Stack>
      </DesktopShell>
      {session ? <FeedbackButton /> : null}
    </ThemeProvider>
  );
}
