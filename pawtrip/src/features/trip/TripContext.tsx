import { createContext, useCallback, useContext, useMemo, useState, type ComponentRef, type ReactNode, type Ref } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useItems } from '@/api/items';
import type { TripDetail } from '@/api/trips';
import { useAuth } from '@/auth/AuthProvider';
import { RefreshScroll } from '@/components/ui/RefreshScroll';
import type { ItemView } from '@/features/plan/model';
import { buildDays, todayIso } from '@/lib/dates';

export type Person = { id: string; name: string; url: string | null };
export type TripDog = { id: string; name: string; photo: string | null; alone: number | null; temp: number | null; ownerId: string };

/** What the "add" sheet should start with. */
export type AddRequest = { origin: 'plan' | 'idea'; day?: number; start?: number; end?: number };

type Ctx = {
  trip: TripDetail;
  userId: string;
  isLeader: boolean;
  /** every date of the trip (YYYY-MM-DD) */
  days: string[];
  day: number;
  setDay: (i: number) => void;
  members: Person[];
  person: (id: string | null | undefined) => Person | undefined;
  dogs: TripDog[];
  items: ItemView[];
  itemsLoading: boolean;
  itemsError: boolean;
  refetchItems: () => void;
  /** item detail sheet */
  openItemId: string | null;
  openItem: (id: string | null) => void;
  /** add sheet */
  addRequest: AddRequest | null;
  addItem: (r: AddRequest | null) => void;
};

const TripCtx = createContext<Ctx | null>(null);

export function TripProvider({ trip, children }: { trip: TripDetail; children: ReactNode }) {
  const { userId } = useAuth();
  const days = useMemo(() => buildDays(trip.start_date, trip.end_date), [trip.start_date, trip.end_date]);
  // open on today when the trip is under way, otherwise on the first day
  const [day, setDay] = useState(() => Math.max(0, days.indexOf(todayIso())));
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const [addRequest, setAddRequest] = useState<AddRequest | null>(null);
  const items = useItems(trip.id, days);

  const members = useMemo<Person[]>(
    () => trip.trip_members.map((m) => ({ id: m.user_id, name: m.profiles?.display_name || '?', url: m.profiles?.avatar_url ?? null })),
    [trip.trip_members],
  );
  const dogs = useMemo<TripDog[]>(
    () =>
      trip.trip_dogs.flatMap((d) =>
        d.dogs ? [{ id: d.dogs.id, name: d.dogs.name, photo: d.dogs.photo_url, alone: d.dogs.alone, temp: d.dogs.temp, ownerId: d.dogs.owner_id }] : [],
      ),
    [trip.trip_dogs],
  );
  const person = useCallback((id: string | null | undefined) => members.find((m) => m.id === id), [members]);

  const value = useMemo<Ctx>(
    () => ({
      trip,
      userId: userId!,
      isLeader: trip.creator_id === userId,
      days,
      day: Math.min(day, days.length - 1),
      setDay,
      members,
      person,
      dogs,
      items: items.items,
      itemsLoading: items.isPending,
      itemsError: items.isError,
      refetchItems: () => items.refetch(),
      openItemId,
      openItem: setOpenItemId,
      addRequest,
      addItem: setAddRequest,
    }),
    [trip, userId, days, day, members, person, dogs, items, openItemId, addRequest],
  );
  return <TripCtx.Provider value={value}>{children}</TripCtx.Provider>;
}

export function useTripCtx() {
  const v = useContext(TripCtx);
  if (!v) throw new Error('useTripCtx must be used inside a trip screen');
  return v;
}

/** Scroll area for a trip tab (the shell supplies header and tab bar). */
export function TabBody({ children, innerRef, max }: { children: ReactNode; innerRef?: Ref<ComponentRef<typeof ScrollView>>; max?: number }) {
  const insets = useSafeAreaInsets();
  return (
    <RefreshScroll
      ref={innerRef}
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 + insets.bottom, ...(max ? { maxWidth: max, width: '100%', alignSelf: 'center' as const } : null) }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {children}
    </RefreshScroll>
  );
}
