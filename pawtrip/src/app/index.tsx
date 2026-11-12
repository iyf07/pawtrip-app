import { router } from 'expo-router';
import { ActivityIndicator, Pressable, View } from 'react-native';

import { useMyProfile } from '@/api/profile';
import { useTrips, type TripListItem } from '@/api/trips';
import { useAuth } from '@/auth/AuthProvider';
import { Avatar, AvatarStack } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DogIllo } from '@/components/ui/DogIllo';
import { Screen } from '@/components/ui/Screen';
import { Meta, Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';
import { datesLabel } from '@/lib/dates';

export default function Trips() {
  const { t } = useT();
  const th = useTheme();
  const { userId } = useAuth();
  const me = useMyProfile();
  const trips = useTrips();

  const header = (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12, backgroundColor: th.bg }}>
      <Text weight={800} size={28}>
        {t('trips.title')}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Pressable
          onPress={() => router.push('/new-trip')}
          accessibilityLabel={t('trips.new')}
          style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: th.gold, borderWidth: 4, borderColor: th.sticker, alignItems: 'center', justifyContent: 'center', boxShadow: `0 3px 8px -2px ${th.shadow}` }}>
          <Text size={26} weight={800} color="onGold" style={{ lineHeight: 30 }}>
            +
          </Text>
        </Pressable>
        <Pressable onPress={() => router.push('/profile')} accessibilityLabel={t('profile.title')}>
          <Avatar id={userId ?? 'me'} name={me.data?.display_name} url={me.data?.avatar_url} size={44} />
        </Pressable>
      </View>
    </View>
  );

  const joinButton = (
    <Card dashed onPress={() => router.push('/join')} style={{ alignItems: 'center' }}>
      <Text weight={800} color="muted">
        {t('trips.join')}
      </Text>
    </Card>
  );

  return (
    <Screen top={header} noTopInset={false}>
      {trips.isPending ? (
        <View style={{ alignItems: 'center', paddingTop: 60 }}>
          <ActivityIndicator color={th.muted} />
          <Meta style={{ marginTop: 10 }}>{t('trips.loading')}</Meta>
        </View>
      ) : trips.isError ? (
        <Card style={{ alignItems: 'center', marginTop: 24 }}>
          <Text size={36}>📡</Text>
          <Text weight={800} size={18}>
            {t('common.loadFailed')}
          </Text>
          <Button label={t('common.retry')} onPress={() => trips.refetch()} style={{ marginTop: 12 }} />
        </Card>
      ) : trips.data.length === 0 ? (
        <View style={{ alignItems: 'center', paddingTop: 40 }}>
          <DogIllo size={132} tilt={2} />
          <Text weight={800} size={20} style={{ marginTop: 20 }}>
            {t('trips.empty.title')}
          </Text>
          <Text color="muted" style={{ marginTop: 4, marginBottom: 18, textAlign: 'center' }}>
            {t('trips.empty.body')}
          </Text>
          <Button label={t('trips.new')} onPress={() => router.push('/new-trip')} style={{ alignSelf: 'center' }} />
          <View style={{ alignSelf: 'stretch', marginTop: 24 }}>{joinButton}</View>
        </View>
      ) : (
        <View style={{ gap: 14, marginTop: 4 }}>
          {trips.data.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
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
    <Card onPress={() => router.push({ pathname: '/trip/[id]/plan', params: { id: trip.id } })}>
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
        {trip.place ? ` · ${trip.place}` : ''}
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
