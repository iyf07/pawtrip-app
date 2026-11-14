import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useAuth } from '@/auth/AuthProvider';
import { supabase } from '@/lib/supabase';

import type { Dog, Trip } from './types';

type PersonLite = { display_name: string; avatar_url: string | null; handle?: string };

export type TripListItem = Trip & {
  trip_members: { user_id: string; profiles: PersonLite | null }[];
  trip_dogs: { dog_id: string; dogs: { photo_url: string | null } | null }[];
};

export type TripDetail = Trip & {
  trip_members: { user_id: string; joined_at: string; profiles: PersonLite | null }[];
  trip_dogs: { dog_id: string; added_by: string | null; dogs: (Dog & { profiles: PersonLite | null }) | null }[];
};

export function useTrips() {
  const { userId } = useAuth();
  return useQuery({
    queryKey: ['trips', userId],
    enabled: !!userId,
    queryFn: async (): Promise<TripListItem[]> => {
      const { data, error } = await supabase
        .from('trips')
        .select('*, trip_members(user_id, profiles(display_name, avatar_url)), trip_dogs(dog_id, dogs(photo_url))')
        .order('start_date', { ascending: false });
      if (error) throw error;
      const order = { active: 0, planning: 1, completed: 2 } as const;
      return (data as unknown as TripListItem[]).sort(
        (a, b) => order[a.status as keyof typeof order] - order[b.status as keyof typeof order] || a.start_date.localeCompare(b.start_date),
      );
    },
  });
}

async function fetchTrip(id: string): Promise<TripDetail> {
  const { data, error } = await supabase
    .from('trips')
    .select('*, trip_members(user_id, joined_at, profiles(display_name, avatar_url, handle)), trip_dogs(dog_id, added_by, dogs(*, profiles(display_name, avatar_url)))')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as unknown as TripDetail;
}

export function useTrip(id: string | undefined) {
  return useQuery({ queryKey: ['trip', id], enabled: !!id, queryFn: () => fetchTrip(id!) });
}

/**
 * Load trip details ahead of time. Opening a trip that is not cached yet shows a loading screen, which unmounts
 * the trip's tabs; the router then restores their old state and snaps the URL back to the previous trip.
 */
export function usePrefetchTrips(ids: string[]) {
  const qc = useQueryClient();
  const key = ids.join(',');
  useEffect(() => {
    key.split(',').filter(Boolean).forEach((id) => qc.prefetchQuery({ queryKey: ['trip', id], queryFn: () => fetchTrip(id) }));
  }, [key, qc]);
}

/** Keep the open trip fresh when other members change it. */
export function useTripRealtime(tripId: string | undefined) {
  const qc = useQueryClient();
  useEffect(() => {
    if (!tripId) return;
    const refresh = () => {
      qc.invalidateQueries({ queryKey: ['trip', tripId] });
      qc.invalidateQueries({ queryKey: ['trips'] });
    };
    const refreshItems = () => qc.invalidateQueries({ queryKey: ['items', tripId] });
    const channel = supabase
      // unique per subscription: removeChannel is async, and re-entering the trip right away would otherwise
      // get the old, already-subscribed channel back ("cannot add postgres_changes callbacks after subscribe()")
      .channel(`trip:${tripId}:${Math.random().toString(36).slice(2, 8)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trips', filter: `id=eq.${tripId}` }, refresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trip_members', filter: `trip_id=eq.${tripId}` }, refresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trip_dogs', filter: `trip_id=eq.${tripId}` }, refresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'items', filter: `trip_id=eq.${tripId}` }, refreshItems)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'item_dogs', filter: `trip_id=eq.${tripId}` }, refreshItems)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reactions', filter: `trip_id=eq.${tripId}` }, refreshItems)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments', filter: `trip_id=eq.${tripId}` }, refreshItems)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [tripId, qc]);
}

export type NewTrip = {
  name: string;
  place: string;
  lat: number | null;
  lon: number | null;
  tz: string;
  start_date: string;
  end_date: string;
  interests: string[];
  dogIds: string[];
};

export function useCreateTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ dogIds, ...trip }: NewTrip): Promise<string> => {
      const { data, error } = await supabase.from('trips').insert(trip).select('id').single();
      if (error) throw error;
      if (dogIds.length) {
        const { error: e2 } = await supabase.from('trip_dogs').insert(dogIds.map((dog_id) => ({ trip_id: data.id, dog_id })));
        if (e2) throw e2;
      }
      return data.id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trips'] }),
  });
}

/** How many entries of a trip are scheduled (have a date, a stay or are confirmed): they turn into ideas when the trip moves. */
export async function countScheduled(tripId: string): Promise<number> {
  const { count, error } = await supabase
    .from('items')
    .select('id', { count: 'exact', head: true })
    .eq('trip_id', tripId)
    .or('date.not.is.null,stay_from.not.is.null,confirmed.eq.true');
  if (error) throw error;
  return count ?? 0;
}

/** Move a trip to new dates (leader only). Scheduled entries become ideas; resolves to how many changed. */
export function useMoveTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ tripId, start, end }: { tripId: string; start: string; end: string }): Promise<number> => {
      const { data, error } = await supabase.rpc('move_trip', { p_trip: tripId, p_start: start, p_end: end });
      if (error) throw error;
      return data as number;
    },
    onSuccess: (_n, v) => {
      qc.invalidateQueries({ queryKey: ['trips'] });
      qc.invalidateQueries({ queryKey: ['trip', v.tripId] });
      qc.invalidateQueries({ queryKey: ['items', v.tripId] });
    },
  });
}

export type TripPreview = {
  id: string;
  name: string;
  place: string;
  start_date: string;
  end_date: string;
  members: number;
  dogs: number;
  expired: boolean;
  already_member: boolean;
};

export async function peekTrip(code: string): Promise<TripPreview | null> {
  const { data, error } = await supabase.rpc('peek_trip', { p_code: code });
  if (error) throw error;
  return (data as unknown as TripPreview | null) ?? null;
}

export function useJoinTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ code, dogIds }: { code: string; dogIds: string[] }): Promise<string> => {
      const { data, error } = await supabase.rpc('join_trip', { p_code: code });
      if (error) throw error;
      const tripId = data as string;
      if (dogIds.length) {
        const { error: e2 } = await supabase.from('trip_dogs').insert(dogIds.map((dog_id) => ({ trip_id: tripId, dog_id })));
        if (e2) throw e2;
      }
      return tripId;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trips'] }),
  });
}

function useTripMutation<V, R = void>(fn: (v: V) => Promise<R>, extraKeys: string[][] = []) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['trip'] });
      qc.invalidateQueries({ queryKey: ['trips'] });
      extraKeys.forEach((k) => qc.invalidateQueries({ queryKey: k }));
    },
  });
}

export const useAddDogToTrip = () =>
  useTripMutation(async ({ tripId, dogId }: { tripId: string; dogId: string }) => {
    const { error } = await supabase.from('trip_dogs').insert({ trip_id: tripId, dog_id: dogId });
    if (error) throw error;
  });

export const useRemoveDogFromTrip = () =>
  useTripMutation(async ({ tripId, dogId }: { tripId: string; dogId: string }) => {
    const { error } = await supabase.from('trip_dogs').delete().eq('trip_id', tripId).eq('dog_id', dogId);
    if (error) throw error;
  });

export function useLeaveTrip() {
  const { userId } = useAuth();
  return useTripMutation(async (tripId: string) => {
    const { error } = await supabase.from('trip_members').delete().eq('trip_id', tripId).eq('user_id', userId!);
    if (error) throw error;
  });
}

export const useDeleteTrip = () =>
  useTripMutation(async (tripId: string) => {
    const { error } = await supabase.from('trips').delete().eq('id', tripId);
    if (error) throw error;
  });

export const useRotateInviteCode = () =>
  useTripMutation(async (tripId: string) => {
    const { data, error } = await supabase.rpc('rotate_invite_code', { p_trip: tripId });
    if (error) throw error;
    return data as string;
  });

export const useUpdateTrip = () =>
  useTripMutation(
    async ({ tripId, patch }: { tripId: string; patch: Partial<Pick<Trip, 'status' | 'interests' | 'dist' | 'name'>> }) => {
      const { error } = await supabase.from('trips').update(patch).eq('id', tripId);
      if (error) throw error;
    },
  );
