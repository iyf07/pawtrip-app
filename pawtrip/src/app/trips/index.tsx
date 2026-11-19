import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { useAuth } from '@/auth/AuthProvider';
import { useDeleteTrip, useLeaveTrip, useTrips, type TripListItem } from '@/api/trips';
import { AvatarStack, DogAvatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { Header, Screen } from '@/components/ui/Screen';
import { ConfirmSheet, Sheet } from '@/components/ui/Sheet';
import { SwipeRow } from '@/components/ui/SwipeRow';
import { Text } from '@/components/ui/Text';
import { BENTO_GAP, BENTO_RADIUS, AddButton, BentoAction, BentoCard, BentoColumns, Tile, type Tone } from '@/features/circle/Bento';
import { MonthCalendar } from '@/features/calendar/MonthCalendar';
import { useLayout } from '@/hooks/use-layout';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';
import { datesLabel } from '@/lib/dates';
import { cityState } from '@/lib/place';

const tone = (status: string): Tone => (status === 'active' ? 'butter' : status === 'completed' ? 'card' : 'lavender');

/** The trips page, a bento box: every trip a card coloured by its state, the month calendar beside or below them. */
export default function Trips() {
  const { t, locale } = useT();
  const th = useTheme();
  const { wide } = useLayout();
  const { userId } = useAuth();
  const trips = useTrips();
  const del = useDeleteTrip();
  const leave = useLeaveTrip();
  const [askTrip, setAskTrip] = useState<TripListItem | null>(null);
  const [width, setWidth] = useState(0);
  const [all, setAll] = useState(false);
  const mineTrip = askTrip?.creator_id === userId;
  const list = trips.data ?? [];
  const col = Math.max(0, (width - BENTO_GAP) / 2);
  const rowH = Math.round(col * 0.95);

  const card = (trip: TripListItem, i: number, w: number, h: number) => {
    const done = trip.status === 'completed';
    const people = trip.trip_members.map((m) => ({ id: m.user_id, name: m.profiles?.display_name, url: m.profiles?.avatar_url }));
    return (
      <SwipeRow key={trip.id} radius={BENTO_RADIUS} onTrigger={() => setAskTrip(trip)}>
        <Tile index={i} width={w} height={h} tone={tone(trip.status)} onPress={() => router.push({ pathname: '/trips/[id]/plan', params: { id: trip.id } })} accessibilityLabel={trip.name}>
          <View style={{ flex: 1, padding: 16, justifyContent: 'space-between', opacity: done ? 0.75 : 1 }}>
            <Text weight={800} size={11} numberOfLines={1} style={{ color: th.onGold, letterSpacing: 1.3, textTransform: 'uppercase' }}>{datesLabel(trip.start_date, trip.end_date, locale)}</Text>
            <View style={{ gap: 4 }}>
              <Text weight={800} size={22} numberOfLines={2} style={{ color: th.onGold }}>{trip.name}</Text>
              {cityState(trip.place) ? <Text weight={700} size={12} numberOfLines={1} style={{ color: th.onGold, opacity: 0.7 }}>{cityState(trip.place)}</Text> : null}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <AvatarStack people={people} max={3} size={26} />
              {trip.trip_dogs.slice(0, 2).map((d) => <DogAvatar key={d.dog_id} url={d.dogs?.photo_url ?? null} size={24} />)}
            </View>
          </View>
        </Tile>
      </SwipeRow>
    );
  };

  // a long list does not push the actions and the calendar off the page: the first five are cards, the rest sit behind one "more" card
  const SHOWN = 5;
  const first = list[0];
  const rest = list.slice(1, SHOWN);
  const hidden = list.slice(SHOWN);
  const grid = (
    <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)} style={{ gap: BENTO_GAP }}>
      {width > 0 ? (
        list.length === 0 ? (
          <Tile index={0} width={width} height={rowH} dashed onPress={() => router.push('/trips/new')} accessibilityLabel={t('trips.new')}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 }}><Icon name="nav-trips" size={64} /><Text weight={800} size={16} color="link">{t('trips.new')}</Text></View>
          </Tile>
        ) : (
          <>
            {first ? card(first, 0, width, rowH) : null}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: BENTO_GAP }}>{rest.map((x, i) => card(x, i + 1, col, rowH))}</View>
            {hidden.length > 0 ? (
              <Tile index={6} width={width} height={64} onPress={() => setAll(true)} accessibilityLabel={t('trips.more')}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18 }}>
                  <Text weight={800} size={15}>{t('trips.more')} · {hidden.length}</Text>
                  <Text plain size={22} color="muted" weight={800}>›</Text>
                </View>
              </Tile>
            ) : null}
          </>
        )
      ) : null}
    </View>
  );

  const actions = (
    <View style={{ flexDirection: 'row', gap: BENTO_GAP }}>
      <BentoAction index={6} icon={<Icon name="nav-trips" size={56} />} label={t('trips.new')} onPress={() => router.push('/trips/new')} />
      <BentoAction index={7} icon={<Icon name="ui-key" size={56} />} label={t('trips.joinShort')} onPress={() => router.push('/join')} />
    </View>
  );

  return (
    <Screen nav size={wide ? 'wide' : 'narrow'} top={<Header title={t('trips.title')} />}>
      {trips.isPending ? <PageSkeleton cards={3} /> : trips.isError ? (
        <View style={{ alignItems: 'center', gap: 12, marginTop: 24 }}><Icon name="empty-offline" size={110} /><Text weight={800} size={18}>{t('common.loadFailed')}</Text><Button label={t('common.retry')} onPress={() => trips.refetch()} /></View>
      ) : (
        <View style={{ marginTop: 8, gap: BENTO_GAP }}>
          <BentoColumns
            left={<>{grid}{actions}</>}
            right={<BentoCard index={9} title={t('shell.calendar')} right={<AddButton label={t('trips.new')} onPress={() => router.push('/trips/new')} />}><MonthCalendar embedded /></BentoCard>}
          />
        </View>
      )}
      <Sheet visible={all} tall onClose={() => setAll(false)}>
        <Text weight={800} size={22} style={{ textAlign: 'center' }}>{t('trips.title')}</Text>
        <View style={{ marginTop: 12 }}>
          {list.map((x, i) => (
            <Pressable key={x.id} onPress={() => { setAll(false); router.push({ pathname: '/trips/[id]/plan', params: { id: x.id } }); }} accessibilityRole="button" style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderTopWidth: i ? 1.5 : 0, borderStyle: 'dashed', borderColor: th.line }}>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text weight={800} size={16} numberOfLines={1}>{x.name}</Text>
                <Text weight={700} size={12} color="muted" numberOfLines={1}>{datesLabel(x.start_date, x.end_date, locale)}</Text>
              </View>
              <Text plain size={22} color="muted" weight={800}>›</Text>
            </Pressable>
          ))}
        </View>
      </Sheet>
      <ConfirmSheet visible={askTrip !== null} title={t(mineTrip ? 'delete.title' : 'leave.title')} body={mineTrip ? t('delete.body', { name: askTrip?.name ?? '' }) : t('leave.body')} confirmLabel={t(mineTrip ? 'group.delete' : 'leave.yes')} danger
        onConfirm={() => { const x = askTrip; setAskTrip(null); if (x) (mineTrip ? del : leave).mutate(x.id); }} onClose={() => setAskTrip(null)} />
    </Screen>
  );
}
