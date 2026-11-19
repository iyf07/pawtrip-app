import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { useMyProfile, useSettings } from '@/api/profile';
import { useItems } from '@/api/items';
import { useTrips, type TripListItem } from '@/api/trips';
import { AvatarStack, DogAvatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { Header, Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { BENTO_GAP, BentoAction, BentoCard, Tile, TileHeader, bentoUnits } from '@/features/circle/Bento';
import { NotificationTile } from '@/features/circle/NotificationTile';
import { CatIcon } from '@/features/plan/CatIcon';
import { dayItems } from '@/features/plan/model';
import { WeatherIcon } from '@/features/plan/WeatherIcon';
import { useTimeFmt } from '@/hooks/use-prefs';
import { useLayout } from '@/hooks/use-layout';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';
import { buildDays, datesLabel, daysBetween, todayIso } from '@/lib/dates';
import { cityState } from '@/lib/place';
import { tempOut, useWeather } from '@/lib/weather';

/** The trip that matters now: the one under way, else the nearest one that has not started. */
function pickTrip(list: TripListItem[], today: string) {
  return list.find((x) => x.start_date <= today && x.end_date >= today) ?? list.filter((x) => x.start_date > today).sort((a, b) => a.start_date.localeCompare(b.start_date))[0] ?? null;
}

/**
 * The app's home, a bento box about today: the trip that matters now (with a countdown), its weather, today's timeline,
 * notifications, and a place kept for recommendations. Cards without data yet keep their place.
 */
export default function Home() {
  const { t, locale } = useT();
  const th = useTheme();
  const { wide } = useLayout();
  const me = useMyProfile();
  const trips = useTrips();
  const settings = useSettings();
  const { fmtMin } = useTimeFmt();
  const [width, setWidth] = useState(0);
  const today = todayIso();
  const trip = useMemo(() => pickTrip(trips.data ?? [], today), [trips.data, today]);
  const days = useMemo(() => (trip ? buildDays(trip.start_date, trip.end_date) : []), [trip]);
  const dayIdx = trip ? Math.min(Math.max(daysBetween(trip.start_date, today), 0), days.length - 1) : 0;
  const underway = !!trip && trip.start_date <= today;
  const weather = useWeather({ id: trip?.id ?? '', lat: trip?.lat ?? null, lon: trip?.lon ?? null, tz: trip?.tz ?? 'UTC' }, days);
  const items = useItems(trip?.id, days).items;
  const rows = useMemo(() => dayItems(items, dayIdx).sort((a, b) => (a.start ?? 0) - (b.start ?? 0)), [items, dayIdx]);
  const wx = weather.data?.[days[dayIdx] ?? ''];
  const unit = settings.data?.temp_unit === 'C' ? 'C' : 'F';

  const { col, row: phoneRow } = bentoUnits(width);
  const half = Math.max(0, (width - BENTO_GAP) / 2);
  const row = wide ? Math.round(((width - 3 * BENTO_GAP) / 4) * 0.9) : phoneRow;
  const sideW = wide ? half : col * 2 + BENTO_GAP;
  const small = Math.max(0, (sideW - BENTO_GAP) / 2);
  const pad = { flex: 1, padding: 18, gap: 6 } as const;
  const people = (trip?.trip_members ?? []).map((m) => ({ id: m.user_id, name: m.profiles?.display_name, url: m.profiles?.avatar_url }));

  const heroTile = trip ? (
    <Tile index={0} width={sideW} height={row * 2 + BENTO_GAP} tone="lavender" onPress={() => router.push({ pathname: '/trips/[id]/plan', params: { id: trip.id } })} accessibilityLabel={trip.name}>
      <View style={{ flex: 1, padding: 20, justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Text weight={800} size={12} numberOfLines={1} style={{ flex: 1, color: th.onGold, letterSpacing: 1.4, textTransform: 'uppercase' }}>{[datesLabel(trip.start_date, trip.end_date, locale), cityState(trip.place)].filter(Boolean).join(' · ')}</Text>
        </View>
        <View style={{ gap: 4 }}>
          <Text weight={800} size={64} style={{ color: th.onGold, lineHeight: 70 }}>{underway ? dayIdx + 1 : daysBetween(today, trip.start_date)}</Text>
          <Text weight={800} size={12} style={{ color: th.onGold, letterSpacing: 1.4, textTransform: 'uppercase' }}>{underway ? t('home.dayOf', { n: days.length }) : t('home.daysTo')}</Text>
        </View>
        <View style={{ gap: 12 }}>
          <Text weight={800} size={30} numberOfLines={2} style={{ color: th.onGold }}>{trip.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <AvatarStack people={people} max={5} size={34} />
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {trip.trip_dogs.slice(0, 4).map((d) => <DogAvatar key={d.dog_id} url={d.dogs?.photo_url ?? null} size={30} />)}
            </View>
          </View>
        </View>
      </View>
    </Tile>
  ) : (
    <Tile index={0} width={sideW} height={row * 2 + BENTO_GAP} dashed onPress={() => router.push('/trips/new')} accessibilityLabel={t('trips.new')}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 }}><Icon name="nav-trips" size={72} /><Text weight={800} size={18} color="link">{t('trips.new')}</Text></View>
    </Tile>
  );

  const weatherTile = (
    <Tile index={1} width={small} height={row} tone="tint">
      <View style={pad}>
        <TileHeader ink={th.onGold} title={t('home.weather')} />
        {wx ? (
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <WeatherIcon icon={wx.icon} size={44} />
            <View>
              <Text weight={800} size={30} style={{ color: th.onGold, lineHeight: 34 }}>{tempOut(wx.hi, unit)}°</Text>
              <Text weight={700} size={13} style={{ color: th.onGold, opacity: 0.7 }}>{tempOut(wx.lo, unit)}°</Text>
            </View>
          </View>
        ) : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><WeatherIcon icon="partly" size={48} /></View>}
      </View>
    </Tile>
  );

  const timelineCard = (
    <BentoCard index={2} title={t('home.today')}>
      {rows.length === 0 ? <View style={{ alignItems: 'center', paddingVertical: 14 }}><Icon name="empty-day" size={72} /></View> : rows.slice(0, 5).map((it, i) => (
        <View key={it.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6, borderTopWidth: i ? 1.5 : 0, borderStyle: 'dashed', borderColor: th.line }}>
          <Text weight={800} size={13} color="muted" style={{ width: 62 }}>{it.start != null ? fmtMin(it.start) : ''}</Text>
          <CatIcon cat={it.cat} size={24} />
          <Text weight={700} size={15} numberOfLines={1} style={{ flex: 1 }}>{it.title}</Text>
        </View>
      ))}
    </BentoCard>
  );

  // reserved for recommendations (not built yet): keeps its place
  const recommendTile = (
    <Tile index={4} width={width} height={Math.round(row * 0.8)} dashed accessibilityLabel={t('home.recommend')}>
      <View style={{ flex: 1, padding: 18, gap: 10 }}>
        <TileHeader title={t('home.recommend')} />
        <View style={{ flex: 1, justifyContent: 'center', gap: 8 }}>
          <View style={{ height: 10, width: '70%', borderRadius: 5, backgroundColor: th.line }} />
          <View style={{ height: 10, width: '45%', borderRadius: 5, backgroundColor: th.line }} />
        </View>
      </View>
    </Tile>
  );

  return (
    <Screen nav size={wide ? 'wide' : 'narrow'} top={<Header title={t('home.title', { name: me.data?.display_name ?? '' })} />}>
      <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)} style={{ marginTop: 8, gap: BENTO_GAP }}>
        {width > 0 ? (
          <>
            {wide ? (
              <View style={{ flexDirection: 'row', gap: BENTO_GAP, alignItems: 'flex-start' }}>
                {heroTile}
                <View style={{ gap: BENTO_GAP, width: sideW }}>
                  <View style={{ flexDirection: 'row', gap: BENTO_GAP }}>{weatherTile}<NotificationTile index={3} width={small} height={row} /></View>
                  {timelineCard}
                </View>
              </View>
            ) : (
              <>
                {heroTile}
                <View style={{ flexDirection: 'row', gap: BENTO_GAP }}>{weatherTile}<NotificationTile index={3} width={small} height={row} /></View>
                {timelineCard}
              </>
            )}
            {recommendTile}
            {!trip ? <View style={{ flexDirection: 'row' }}><BentoAction index={5} icon={<Icon name="ui-key" size={56} />} label={t('trips.join')} onPress={() => router.push('/join')} /></View> : null}
          </>
        ) : null}
      </View>
    </Screen>
  );
}
