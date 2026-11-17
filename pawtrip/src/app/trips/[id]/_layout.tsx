import { Tabs, useLocalSearchParams } from 'expo-router';
import { useState, type ComponentProps } from 'react';
import { View } from 'react-native';

import { useTrip, useTripRealtime } from '@/api/trips';
import { BottomTabBar } from '@/components/BottomTabBar';
import { TripFaces } from '@/components/TripFaces';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Sheet } from '@/components/ui/Sheet';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { BackButton, Header, Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLayout } from '@/hooks/use-layout';
import { AddItemSheet } from '@/features/plan/AddItemSheet';
import { ItemDetailSheet } from '@/features/plan/ItemDetailSheet';
import { TripProvider } from '@/features/trip/TripContext';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';
import { datesLabel } from '@/lib/dates';
import { cityState } from '@/lib/place';
import { goBack } from '@/lib/nav';

type BarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

const TAB_ICON: Record<string, IconName> = { plan: 'tab-plan', map: 'pin-stop', ideas: 'tab-ideas', group: 'tab-members' };

function TripTabBar({ state, navigateToTab }: BarProps) {
  const { t } = useT();
  const { wide } = useLayout();

  // desktop: the sections are a column in the shell instead
  if (wide) return null;

  return (
    <BottomTabBar
      value={state.routes[state.index].key}
      tabs={state.routes.map((route) => ({ value: route.key, label: t(`tab.${route.name}` as 'tab.plan'), icon: TAB_ICON[route.name] ?? 'tab-plan' }))}
      onChange={navigateToTab}
    />
  );
}

export default function TripLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, locale } = useT();
  const th = useTheme();
  const { wide, medium } = useLayout();
  const [showInfo, setShowInfo] = useState(false);
  useTripRealtime(id);
  const q = useTrip(id);

  // the long label would squeeze the trip name on a phone
  const back = <BackButton label={t(medium ? 'nav.backTrips' : 'nav.backTripsShort')} onPress={goBack} />;

  if (q.isPending) {
    return (
      <Screen nav scroll={false} top={<Header left={back} />}>
        <View style={{ paddingHorizontal: 16 }}>
          <PageSkeleton cards={3} />
        </View>
      </Screen>
    );
  }
  if (q.isError) {
    return (
      <Screen nav scroll={false} top={<Header left={back} />}>
        <Card style={{ alignItems: 'center', marginTop: 24 }}>
          <Icon name="empty-offline" size={72} />
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
        nav
        scroll={false}
        size={wide ? "full" : "narrow"}
        contentStyle={{ paddingHorizontal: 0 }}
        top={
          <Header
            left={back}
            sideWidth={wide ? 144 : 68}
            title={trip.name}
            onTitlePress={() => setShowInfo(true)}
            titleAccessibilityLabel={t('trip.openInfo', { name: trip.name })}
            right={<TripFaces trip={trip} />}
          />
        }>
        <Tabs tabBar={(props) => <TripTabBar {...props} />} screenOptions={{ headerShown: false, tabBarPosition: wide ? 'top' : 'bottom', sceneStyle: { backgroundColor: th.bg } }}>
          <Tabs.Screen name="plan" />
          <Tabs.Screen name="map" />
          <Tabs.Screen name="ideas" />
          <Tabs.Screen name="group" />
        </Tabs>
        <Sheet visible={showInfo} onClose={() => setShowInfo(false)}>
          <Text weight={800} size={22}>{trip.name}</Text>
          <Text weight={800} size={14} color="muted" style={{ marginTop: 16 }}>{t('trip.date')}</Text>
          <Text>{datesLabel(trip.start_date, trip.end_date, locale)}</Text>
          <Text weight={800} size={14} color="muted" style={{ marginTop: 12 }}>{t('trip.location')}</Text>
          <Text>{cityState(trip.place) || '—'}</Text>
        </Sheet>
        <ItemDetailSheet />
        <AddItemSheet />
      </Screen>
    </TripProvider>
  );
}
