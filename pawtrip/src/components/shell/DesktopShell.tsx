import { router, useGlobalSearchParams, usePathname } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { DogTraits } from '@/components/DogTraits';
import { PersonTraits } from '@/components/PersonTraits';
import { dogWeightLabel } from '@/lib/dog-weight';
import { useBuddies } from '@/api/buddies';
import { collectionDetail } from '@/lib/collection-layout';
import { useMyDogs } from '@/api/dogs';
import { useMyProfile } from '@/api/profile';
import { useTrips, type TripListItem } from '@/api/trips';
import { useAuth } from '@/auth/AuthProvider';
import { Avatar, AvatarStack, DogAvatar } from '@/components/ui/Avatar';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Meta, Text } from '@/components/ui/Text';
import { useLayout } from '@/hooks/use-layout';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';
import { datesLabel } from '@/lib/dates';
import { cityState } from '@/lib/place';

import { NotificationBell } from '@/components/NotificationBell';
import { ShellContext } from './ShellContext';

type Section = 'calendar' | 'trips' | 'dogs' | 'buddies' | 'profile' | 'settings';

const RAIL_W = 76;
const LIST_W = 232;

/** Full-screen flows (sign-in, onboarding, new trip, join, the new-dog wizard) never show the shell. */
const isFlow = (p: string) => /^\/(sign-in|onboarding|join)(\/|$)/.test(p) || p === '/trips/new' || p === '/dogs/new';

const sectionOf = (p: string): Section => (p.startsWith('/calendar') ? 'calendar' : p.startsWith('/dog') ? 'dogs' : (p.startsWith('/friends') || p.startsWith('/family')) ? 'buddies' : p.startsWith('/profile') ? 'profile' : p.startsWith('/settings') ? 'settings' : 'trips');

/**
 * Desktop web layout (TickTick style): a narrow rail (profile, trips, dogs, settings), a list column for the
 * selected section, and the routed screen as the main area. On narrower windows it renders nothing but the screen.
 */
export function DesktopShell({ enabled, children }: { enabled: boolean; children: ReactNode }) {
  const { wide } = useLayout();
  const path = usePathname();
  const active = enabled && wide && !isFlow(path);
  const section = sectionOf(path);
  const tripId = /^\/trips\/([^/]+)/.exec(path)?.[1] ?? null;
  const dogId = /^\/dogs\/([^/]+)/.exec(path)?.[1] ?? null;
  const { friend } = useGlobalSearchParams<{ friend?: string }>();
  const detail = collectionDetail(path, friend);
  const showList = active && !!detail;
  const tab = path.endsWith('/ideas') ? 'ideas' : path.endsWith('/group') ? 'group' : 'plan';

  return (
    <ShellContext.Provider value={active}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {active ? <Rail section={section} /> : null}
        {showList ? section === 'dogs' ? <DogList selected={dogId} /> : section === 'buddies' ? <FriendList selected={friend} /> : <TripList selected={tripId} /> : null}
        {showList && detail ? <CollapseList home={detail.home} /> : null}
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
  router.replace({ pathname: '/trips/[id]/plan', params: { id } });
}

function Rail({ section }: { section: Section }) {
  const { t } = useT();
  const th = useTheme();
  const { userId } = useAuth();
  const me = useMyProfile();
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
        <Icon name="logo-paw" size={56} />
      </Pressable>
      {item('calendar', 'tab-plan', t('shell.calendar'), () => router.navigate('/calendar'))}
      {item('trips', 'nav-trips', t('shell.trips'), () => router.navigate('/'))}
      {item('dogs', 'nav-dogs', t('shell.dogs'), () => router.navigate('/dogs'))}
      {item('buddies', 'tab-members', t('shell.buddies'), () => { router.setParams({ friend: undefined, add: undefined }); router.navigate('/friends'); })}
      <View style={{ flex: 1 }} />
      <NotificationBell size={40} box={52} radius={16} />
      {item('settings', 'nav-settings', t('shell.settings'), () => router.navigate('/settings'))}
      <Pressable
        onPress={() => router.navigate('/profile')}
        accessibilityRole="button"
        accessibilityLabel={t('profile.title')}
        style={{ padding: 3, borderRadius: 24, borderWidth: 3, borderColor: section === 'profile' ? th.gold : 'transparent', marginTop: 2 }}>
        <Avatar id={userId ?? 'me'} name={me.data?.display_name} url={me.data?.avatar_url} size={44} />
      </Pressable>
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

function AddLink({ label, onPress, icon }: { label: string; onPress: () => void; icon?: IconName }) {
  const th = useTheme();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={{ padding: 10, borderRadius: 14, borderWidth: 2, borderStyle: 'dashed', borderColor: th.line, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      {icon ? <Icon name={icon} size={26} /> : null}
      <Text weight={800} color="link" size={14}>
        {label}
      </Text>
    </Pressable>
  );
}

function TripList({ selected }: { selected: string | null }) {
  const { t, locale } = useT();
  const trips = useTrips();
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
      <AddLink icon="nav-trips" label={t('trips.new')} onPress={() => router.push('/trips/new')} />
      <AddLink icon="ui-key" label={noEmoji(t('trips.join'))} onPress={() => router.push('/join')} />
    </ListFrame>
  );
}

function DogList({ selected }: { selected: string | null }) {
  const { t } = useT();
  const dogs = useMyDogs();
  return (
    <ListFrame title={t('profile.myDogs')}>
      {(dogs.data ?? []).map((d) => (
        <Row key={d.id} on={d.id === selected} onPress={() => router.navigate({ pathname: '/dogs/[id]', params: { id: d.id } })}>
          <DogAvatar url={d.photo_url} />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text weight={800} numberOfLines={1}>{d.name}</Text>
            {dogWeightLabel(d) ? <Meta numberOfLines={1}>{dogWeightLabel(d)}</Meta> : null}
            <DogTraits dog={d} lines={1} />
          </View>
        </Row>
      ))}
      <AddLink icon="nav-dogs" label={t('profile.addDog')} onPress={() => router.push({ pathname: '/dogs/[id]', params: { id: 'new' } })} />
    </ListFrame>
  );
}

function FriendList({ selected }: { selected?: string }) {
  const { t } = useT();
  const buddies = useBuddies();
  return <ListFrame title={t('bd.title')}>
    {(buddies.data ?? []).map((b) => <Row key={b.userId} on={selected === b.userId} onPress={() => router.replace({ pathname: '/friends', params: { friend: b.userId } })}>
      <Avatar id={b.userId} name={b.name} url={b.avatar} size={36} />
      <View style={{ flex: 1, minWidth: 0 }}><Text weight={800} numberOfLines={1}>{b.name}</Text><Meta numberOfLines={1}>@{b.handle}</Meta><PersonTraits profile={b.traits} /></View>
    </Row>)}
    <AddLink icon="tab-members" label={t('bd.addTitle')} onPress={() => router.setParams({ add: '1' })} />
  </ListFrame>;
}

function CollapseList({ home }: { home: '/' | '/dogs' | '/friends' }) {
  const { t } = useT();
  const th = useTheme();
  return <View style={{ width: 0, zIndex: 5 }}>
    <Pressable onPress={() => { if (home === '/friends') router.setParams({ friend: undefined, add: undefined }); router.replace(home); }} accessibilityRole="button" accessibilityLabel={t('collection.collapse')} hitSlop={8}
      style={{ position: 'absolute', left: -14, top: '45%', width: 26, height: 56, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: th.card, borderWidth: 2, borderColor: th.line }}>
      <Text plain size={20} weight={800} color="muted">◂</Text>
    </Pressable>
  </View>;
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
    <View style={{ width: 132, borderRightWidth: 2, borderStyle: 'dashed', borderColor: th.line, paddingTop: 18, paddingHorizontal: 10, gap: 6 }}>
      {SECTIONS.map((s) => (
        <Row
          key={s.key}
          label={t(s.label)}
          on={tab === s.key}
          onPress={() => {
            if (tab !== s.key) router.navigate({ pathname: `/trips/[id]/${s.key}`, params: { id: tripId } });
          }}>
          <Icon name={s.icon} size={34} />
          <Text weight={800} size={15} color={tab === s.key ? 'text' : 'muted'}>
            {t(s.label)}
          </Text>
        </Row>
      ))}
    </View>
  );
}
