import { router, usePathname } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { useMyDogs } from '@/api/dogs';
import { useMyProfile } from '@/api/profile';
import { usePrefetchTrips, useTrips, type TripListItem } from '@/api/trips';
import { useAuth } from '@/auth/AuthProvider';
import { Avatar, AvatarStack, DogAvatar } from '@/components/ui/Avatar';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Meta, Text } from '@/components/ui/Text';
import { useLayout } from '@/hooks/use-layout';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';
import { datesLabel } from '@/lib/dates';
import { cityState } from '@/lib/place';

import { ShellContext } from './ShellContext';

type Section = 'trips' | 'dogs' | 'profile' | 'settings';

const RAIL_W = 76;
const LIST_W = 252;
// below this width the trip list folds away while a trip is open, to leave room for the plan
const FULL_WIDTH = 1400;

/** Full-screen flows (sign-in, onboarding, new trip, join, the new-dog wizard) never show the shell. */
const isFlow = (p: string) => /^\/(sign-in|onboarding|new-trip|join)(\/|$)/.test(p) || p === '/dog/new';

const sectionOf = (p: string): Section => (p.startsWith('/dog') ? 'dogs' : p.startsWith('/profile') ? 'profile' : p.startsWith('/settings') ? 'settings' : 'trips');

/**
 * Desktop web layout (TickTick style): a narrow rail (profile, trips, dogs, settings), a list column for the
 * selected section, and the routed screen as the main area. On narrower windows it renders nothing but the screen.
 */
export function DesktopShell({ enabled, children }: { enabled: boolean; children: ReactNode }) {
  const { wide, width } = useLayout();
  const path = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [lastTrip, setLastTrip] = useState<string | null>(null); // where the Trips button returns to
  const active = enabled && wide && !isFlow(path);
  const section = sectionOf(path);
  const tripId = /^\/trip\/([^/]+)/.exec(path)?.[1] ?? null;
  const dogId = /^\/dog\/([^/]+)/.exec(path)?.[1] ?? null;
  if (tripId && tripId !== lastTrip) setLastTrip(tripId); // remember it (adjusting state while rendering)
  const folded = width < FULL_WIDTH && !!tripId && !expanded;
  const showList = active && (section === 'dogs' || (section === 'trips' && !folded));
  const tab = path.endsWith('/ideas') ? 'ideas' : path.endsWith('/group') ? 'group' : 'plan';

  return (
    <ShellContext.Provider value={active}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {active ? <Rail section={section} onTrip={!!tripId} lastTrip={lastTrip} onToggleList={() => setExpanded((v) => !v)} /> : null}
        {showList ? section === 'dogs' ? <DogList selected={dogId} /> : <TripList selected={tripId} /> : null}
        {active && section === 'trips' && tripId ? <TripSections tripId={tripId} tab={tab} /> : null}
        <View style={{ flex: 1, minWidth: 0 }}>{children}</View>
      </View>
    </ShellContext.Provider>
  );
}

/**
 * Switch trips by replacing the trip screen: navigating between two ids of the same dynamic route reuses the
 * trip's nested tabs with their old state, which left the old trip showing until a second click.
 */
/** The list column carries no emoji (icons are being replaced by a custom set). */
const noEmoji = (text: string) => text.replace(/\p{Extended_Pictographic}\uFE0F?\s*/gu, '').trim();

function openTrip(id: string) {
  router.replace({ pathname: '/trip/[id]/plan', params: { id } });
}

function Rail({ section, onTrip, lastTrip, onToggleList }: { section: Section; onTrip: boolean; lastTrip: string | null; onToggleList: () => void }) {
  const { t } = useT();
  const th = useTheme();
  const { userId } = useAuth();
  const me = useMyProfile();
  const dogs = useMyDogs();
  const trips = useTrips();

  const item = (key: Section, icon: IconName, label: string, onPress: () => void) => {
    const on = section === key;
    return (
      <Pressable
        key={key}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ selected: on }}
        style={{ width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? th.gold : 'transparent' }}>
        <Icon name={icon} size={40} />
      </Pressable>
    );
  };

  return (
    <View style={{ width: RAIL_W, backgroundColor: th.card, borderRightWidth: 2, borderStyle: 'dashed', borderColor: th.line, alignItems: 'center', paddingVertical: 14, gap: 8 }}>
      <Pressable onPress={() => router.navigate('/')} accessibilityRole="link" accessibilityLabel="PawTrip" style={{ marginBottom: 4 }}>
        <Icon name="logo-paw" size={40} />
      </Pressable>
      <Pressable
        onPress={() => router.navigate('/profile')}
        accessibilityRole="button"
        accessibilityLabel={t('profile.title')}
        style={{ padding: 3, borderRadius: 24, borderWidth: 3, borderColor: section === 'profile' ? th.gold : 'transparent', marginBottom: 6 }}>
        <Avatar id={userId ?? 'me'} name={me.data?.display_name} url={me.data?.avatar_url} size={44} />
      </Pressable>
      {item('trips', 'nav-trips', t('shell.trips'), () => {
        if (section === 'trips' && onTrip) return onToggleList();
        // straight back to the trip you were on (going through "/" left stray screens in the history)
        const id = lastTrip ?? trips.data?.[0]?.id;
        if (id) openTrip(id);
        else router.navigate('/');
      })}
      {item('dogs', 'nav-dogs', t('shell.dogs'), () => {
        const first = dogs.data?.[0];
        router.navigate(first ? { pathname: '/dog/[id]', params: { id: first.id } } : { pathname: '/dog/[id]', params: { id: 'new' } });
      })}
      <View style={{ flex: 1 }} />
      {item('settings', 'nav-settings', t('shell.settings'), () => router.navigate('/settings'))}
    </View>
  );
}

function ListFrame({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  const th = useTheme();
  return (
    <View style={{ width: LIST_W, borderRightWidth: 2, borderStyle: 'dashed', borderColor: th.line }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 18, paddingBottom: 10 }}>
        <Text weight={800} size={20}>
          {title}
        </Text>
        {action}
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 24, gap: 6 }} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </View>
  );
}

function Row({ on, onPress, children, label }: { on: boolean; onPress: () => void; children: ReactNode; label?: string }) {
  const th = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: on }}
      style={{ padding: 10, borderRadius: 14, backgroundColor: on ? th.goldBg : 'transparent', borderWidth: 2, borderColor: on ? th.gold : 'transparent', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      {children}
    </Pressable>
  );
}

function AddLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={{ padding: 10, borderRadius: 14, borderWidth: 2, borderStyle: 'dashed', borderColor: 'transparent' }}>
      <Text weight={800} color="link" size={14}>
        {label}
      </Text>
    </Pressable>
  );
}

function TripList({ selected }: { selected: string | null }) {
  const { t, locale } = useT();
  const trips = useTrips();
  usePrefetchTrips((trips.data ?? []).map((x) => x.id)); // see usePrefetchTrips
  return (
    <ListFrame title={t('trips.title')}>
      {(trips.data ?? []).map((trip: TripListItem) => (
        <Row key={trip.id} on={trip.id === selected} onPress={() => openTrip(trip.id)}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text weight={800} numberOfLines={1}>
              {trip.name}
            </Text>
            <Meta numberOfLines={1}>{datesLabel(trip.start_date, trip.end_date, locale)}</Meta>
            <Meta numberOfLines={1}>{cityState(trip.place) || '—'}</Meta>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <AvatarStack people={trip.trip_members.map((m) => ({ id: m.user_id, name: m.profiles?.display_name, url: m.profiles?.avatar_url }))} size={22} max={4} />
            </View>
          </View>
        </Row>
      ))}
      <AddLink label={`+ ${t('trips.new')}`} onPress={() => router.push('/new-trip')} />
      <AddLink label={noEmoji(t('trips.join'))} onPress={() => router.push('/join')} />
    </ListFrame>
  );
}

function DogList({ selected }: { selected: string | null }) {
  const { t } = useT();
  const dogs = useMyDogs();
  return (
    <ListFrame title={t('profile.myDogs')}>
      {(dogs.data ?? []).map((d) => (
        <Row key={d.id} on={d.id === selected} onPress={() => router.navigate({ pathname: '/dog/[id]', params: { id: d.id } })}>
          <DogAvatar url={d.photo_url} />
          <Text weight={800} style={{ flex: 1 }} numberOfLines={1}>
            {d.name}
          </Text>
        </Row>
      ))}
      <AddLink label={t('profile.addDog')} onPress={() => router.push({ pathname: '/dog/[id]', params: { id: 'new' } })} />
    </ListFrame>
  );
}

const SECTIONS = [
  { key: 'plan', icon: 'tab-plan', label: 'tab.plan' },
  { key: 'ideas', icon: 'tab-ideas', label: 'tab.ideas' },
  { key: 'group', icon: 'tab-members', label: 'tab.group' },
] as const;

/** The open trip's sections (plan / ideas / members) as their own column. */
function TripSections({ tripId, tab }: { tripId: string; tab: 'plan' | 'ideas' | 'group' }) {
  const { t } = useT();
  const th = useTheme();
  return (
    <View style={{ width: 76, alignItems: 'center', borderRightWidth: 2, borderStyle: 'dashed', borderColor: th.line, paddingTop: 18, paddingHorizontal: 10, gap: 6 }}>
      {SECTIONS.map((s) => (
        <Row
          key={s.key}
          label={t(s.label)}
          on={tab === s.key}
          onPress={() => {
            if (tab !== s.key) router.navigate({ pathname: `/trip/[id]/${s.key}`, params: { id: tripId } });
          }}>
          <Icon name={s.icon} size={40} />
        </Row>
      ))}
    </View>
  );
}
