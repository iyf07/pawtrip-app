import { Tabs, useLocalSearchParams } from 'expo-router';
import type { ComponentProps } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTrip, useTripRealtime } from '@/api/trips';
import { HeaderActions } from '@/components/HeaderActions';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Header, Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { MAX_WIDTH } from '@/constants/theme';
import { AddItemSheet } from '@/features/plan/AddItemSheet';
import { ItemDetailSheet } from '@/features/plan/ItemDetailSheet';
import { TripProvider } from '@/features/trip/TripContext';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';
import { goBack } from '@/lib/nav';

type BarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

const TAB_ICON: Record<string, string> = { plan: '📅', ideas: '💡', group: '👥' };

function TripTabBar({ state, navigateToTab }: BarProps) {
  const th = useTheme();
  const { t } = useT();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ backgroundColor: th.card, borderTopWidth: 2, borderStyle: 'dashed', borderColor: th.line, alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', width: '100%', maxWidth: MAX_WIDTH, gap: 4, paddingHorizontal: 8, paddingTop: 8, paddingBottom: 8 + insets.bottom }}>
        {state.routes.map((route, i) => {
          const on = state.index === i;
          return (
            <Pressable
              key={route.key}
              onPress={() => {
                if (!on) navigateToTab(route.key);
              }}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
              style={{ flex: 1, minHeight: 54, borderRadius: 18, alignItems: 'center', justifyContent: 'center', gap: 2, backgroundColor: on ? th.gold : 'transparent' }}>
              <Text size={20} style={{ lineHeight: 24 }}>
                {TAB_ICON[route.name] ?? '•'}
              </Text>
              <Text weight={800} size={12} color={on ? 'onGold' : 'muted'}>
                {t(`tab.${route.name}` as 'tab.plan')}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TripLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useT();
  const th = useTheme();
  useTripRealtime(id);
  const q = useTrip(id);

  const back = <Button label={t('nav.backTrips')} variant="text" onPress={goBack} />;

  if (q.isPending) {
    return (
      <Screen scroll={false} top={<Header left={back} />}>
        <View style={{ alignItems: 'center', paddingTop: 60 }}>
          <ActivityIndicator color={th.muted} />
        </View>
      </Screen>
    );
  }
  if (q.isError) {
    return (
      <Screen scroll={false} top={<Header left={back} />}>
        <Card style={{ alignItems: 'center', marginTop: 24 }}>
          <Text size={36}>📡</Text>
          <Text weight={800} size={18}>
            {t('common.loadFailed')}
          </Text>
          <Button label={t('common.retry')} onPress={() => q.refetch()} style={{ marginTop: 12 }} />
        </Card>
      </Screen>
    );
  }

  const trip = q.data;
  return (
    <TripProvider trip={trip}>
      <Screen
        scroll={false}
        contentStyle={{ paddingHorizontal: 0 }}
        top={
          <Header
            left={back}
            right={<HeaderActions size={34} />}
            title={trip.name}
            subtitle={`${t('people', { n: trip.trip_members.length })} · ${t('dogs', { n: trip.trip_dogs.length })}`}
          />
        }>
        <Tabs tabBar={(props) => <TripTabBar {...props} />} screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: th.bg } }}>
          <Tabs.Screen name="plan" />
          <Tabs.Screen name="ideas" />
          <Tabs.Screen name="group" />
        </Tabs>
        <ItemDetailSheet />
        <AddItemSheet />
      </Screen>
    </TripProvider>
  );
}
