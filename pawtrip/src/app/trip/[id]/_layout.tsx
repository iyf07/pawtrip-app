import { Tabs, useLocalSearchParams } from 'expo-router';
import type { ComponentProps } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTrip, useTripRealtime } from '@/api/trips';
import { HeaderActions } from '@/components/HeaderActions';
import { TripFaces } from '@/components/TripFaces';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Header, Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { MAX_WIDTH } from '@/constants/theme';
import { useLayout } from '@/hooks/use-layout';
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
  const { wide } = useLayout();

  // desktop: compact pills at the top, under the header
  if (wide) {
    return (
      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingTop: 4, paddingBottom: 10 }}>
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
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 40, paddingHorizontal: 18, borderRadius: 20, backgroundColor: on ? th.gold : th.card, borderWidth: 2, borderColor: on ? th.gold : th.line }}>
              <Text size={16} style={{ lineHeight: 20 }}>
                {TAB_ICON[route.name] ?? '•'}
              </Text>
              <Text weight={800} size={14} color={on ? 'onGold' : 'text'}>
                {t(`tab.${route.name}` as 'tab.plan')}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
  }

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
  const { wide, medium } = useLayout();
  useTripRealtime(id);
  const q = useTrip(id);

  // the long label would squeeze the trip name on a phone
  const back = <Button label={t(medium ? 'nav.backTrips' : 'nav.backTripsShort')} variant="text" onPress={goBack} />;

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
        size="full"
        contentStyle={{ paddingHorizontal: 0 }}
        top={
          <Header
            left={back}
            right={<HeaderActions size={34} />}
            title={trip.name}
            subtitleNode={<TripFaces trip={trip} />}
          />
        }>
        <Tabs tabBar={(props) => <TripTabBar {...props} />} screenOptions={{ headerShown: false, tabBarPosition: wide ? 'top' : 'bottom', sceneStyle: { backgroundColor: th.bg } }}>
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
