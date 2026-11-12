import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/nunito';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useMyProfile } from '@/api/profile';
import { AuthProvider, useAuth } from '@/auth/AuthProvider';
import { FeedbackButton } from '@/components/FeedbackButton';
import { ToastProvider } from '@/components/ui/Toast';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { PrefsProvider } from '@/hooks/use-prefs';
import { I18nProvider } from '@/i18n';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold });
  const [client] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 15_000, retry: 1, refetchOnWindowFocus: true } } }),
  );

  return (
    <QueryClientProvider client={client}>
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
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Protected guard={!session}>
          <Stack.Screen name="sign-in" />
        </Stack.Protected>
        <Stack.Protected guard={needsOnboarding}>
          <Stack.Screen name="onboarding" />
        </Stack.Protected>
        <Stack.Protected guard={!!session && !needsOnboarding}>
          <Stack.Screen name="index" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="new-trip" options={{ presentation: 'modal' }} />
          <Stack.Screen name="join" options={{ presentation: 'modal' }} />
          <Stack.Screen name="profile" />
          <Stack.Screen name="dog/[id]" options={{ presentation: 'modal' }} />
          <Stack.Screen name="trip/[id]" />
        </Stack.Protected>
      </Stack>
      {session ? <FeedbackButton /> : null}
    </ThemeProvider>
  );
}
