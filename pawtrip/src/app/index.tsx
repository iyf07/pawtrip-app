import { router } from 'expo-router';
import { View } from 'react-native';

import { AddAction } from '@/components/ui/AddAction';
import { useTrips, type TripListItem } from '@/api/trips';
import { Icon } from '@/components/ui/Icon';
import { AvatarStack } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { Header, Screen } from '@/components/ui/Screen';
import { Meta, Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';
import { datesLabel } from '@/lib/dates';
import { cityState } from '@/lib/place';

/** The root: always the trip list (cards), on every screen size. */
export default function Trips() {
  const { t } = useT();
  const trips = useTrips();

  const header = <Header title={t('trips.title')} right={<AddAction label={t('trips.new')} onPress={() => router.push('/trips/new')} />} />;

  const createButton = (
    <Card dashed onPress={() => router.push('/trips/new')} style={{ alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><Icon name="nav-trips" size={28} /><Text weight={800} color="link">{t('trips.new')}</Text></View>
    </Card>
  );

  const joinButton = (
    <Card dashed onPress={() => router.push('/join')} style={{ alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Icon name="ui-key" size={28} />
        <Text weight={800} color="muted">
          {t('trips.join').replace(/^\S*🔑\s*/u, '')}
        </Text>
      </View>
    </Card>
  );

  return (
    <Screen nav top={header} size="narrow">
      {trips.isPending ? (
        <PageSkeleton cards={3} />
      ) : trips.isError ? (
        <Card style={{ alignItems: 'center', alignSelf: 'stretch', marginTop: 24 }}>
          <Icon name="empty-offline" size={110} />
          <Text weight={800} size={18}>
            {t('common.loadFailed')}
          </Text>
          <Button label={t('common.retry')} onPress={() => trips.refetch()} style={{ marginTop: 12 }} />
        </Card>
      ) : trips.data.length === 0 ? (
        <View style={{ alignItems: 'center', paddingTop: 40 }}>
          <Icon name="empty-trips" size={150} />
          <Text weight={800} size={20} style={{ marginTop: 20 }}>
            {t('collection.emptyTrips')}
          </Text>
          <View style={{ alignSelf: 'stretch', marginTop: 24 }}>{createButton}</View>
          <View style={{ alignSelf: 'stretch', marginTop: 24 }}>{joinButton}</View>
        </View>
      ) : (
        <View style={{ gap: 12, marginTop: 4 }}>
          {trips.data.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
          {createButton}
          {joinButton}
        </View>
      )}
    </Screen>
  );
}

function TripCard({ trip }: { trip: TripListItem }) {
  const { t, locale } = useT();
  const th = useTheme();
  const tone =
    trip.status === 'completed'
      ? { bg: th.okBg, fg: th.ok }
      : trip.status === 'active'
        ? { bg: th.blueBg, fg: th.text }
        : { bg: th.goldBg, fg: th.link };
  const people = trip.trip_members.map((m) => ({ id: m.user_id, name: m.profiles?.display_name, url: m.profiles?.avatar_url }));
  return (
    <Card onPress={() => router.push({ pathname: '/trips/[id]/plan', params: { id: trip.id } })}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <Text weight={800} size={18} style={{ flex: 1 }}>
          {trip.name}
        </Text>
        <View style={{ backgroundColor: tone.bg, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 }}>
          <Text weight={800} size={11} style={{ color: tone.fg }}>
            {t(`status.${trip.status}` as 'status.planning')}
          </Text>
        </View>
      </View>
      <Meta style={{ marginTop: 8 }}>
        {datesLabel(trip.start_date, trip.end_date, locale)}
        {cityState(trip.place) ? ` · ${cityState(trip.place)}` : ''}
      </Meta>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 }}>
        <AvatarStack people={people} />
        <Meta weight={700}>
          {t('people', { n: people.length })} · {t('dogs', { n: trip.trip_dogs.length })}
        </Meta>
      </View>
    </Card>
  );
}
