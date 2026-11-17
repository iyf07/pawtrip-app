import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/auth/AuthProvider';
import { supabase } from '@/lib/supabase';
import type { Dog } from './types';
import { normalizeInterests, personScales, type DogScale, type PersonScale } from '@/constants/options';

export type FriendDog = Pick<Dog, 'id' | 'name' | 'photo_url' | 'weight_lb' | 'weight_unit' | 'interests' | DogScale>;

export type Buddy = {
  /** the other person */
  userId: string;
  status: 'pending' | 'accepted';
  /** when they became friends (falls back to when the request was made) */
  since: string;
  /** shared label of the relationship, e.g. bestie */
  relation: string | null;
  /** a pending request: did I send it, or did they send it to me? */
  incoming: boolean;
  name: string;
  avatar: string | null;
  handle: string;
  traits: Record<PersonScale, number | null>;
  interests: string[];
  diet: string[];
  dogs: FriendDog[];
};

/** My buddies: accepted ones, plus requests in both directions that are still waiting. */
export function useBuddies() {
  const { userId } = useAuth();
  return useQuery({
    queryKey: ['buddies', userId],
    enabled: !!userId,
    queryFn: async (): Promise<Buddy[]> => {
      const { data, error } = await supabase.from('buddies').select('*').order('created_at');
      if (error) throw error;
      const others = data.map((r) => ({ r, other: r.requester_id === userId ? r.addressee_id : r.requester_id }));
      if (!others.length) return [];
      const { data: profs, error: e2 } = await supabase.from('profiles').select('id, display_name, avatar_url, handle, interests, diet, morning, noise, walking, temperature, pace, spending').in('id', others.map((o) => o.other));
      if (e2) throw e2;
      const acceptedIds = others.filter(({ r }) => r.status === 'accepted').map(({ other }) => other);
      const { data: dogs, error: dogError } = acceptedIds.length
        ? await supabase.from('dogs').select('*').in('owner_id', acceptedIds).order('created_at')
        : { data: [], error: null };
      if (dogError) throw dogError;
      const byId = new Map(profs.map((p) => [p.id, p]));
      return others.map(({ r, other }) => ({
        userId: other,
        status: r.status as Buddy['status'],
        since: r.accepted_at ?? r.created_at,
        relation: r.relation ?? null,
        incoming: r.addressee_id === userId,
        name: byId.get(other)?.display_name ?? '?',
        avatar: byId.get(other)?.avatar_url ?? null,
        handle: byId.get(other)?.handle ?? '',
        traits: personScales(byId.get(other) ?? {}),
        interests: normalizeInterests(byId.get(other)?.interests ?? []),
        diet: byId.get(other)?.diet ?? [],
        dogs: (dogs ?? []).filter((dog) => dog.owner_id === other),
      }));
    },
  });
}

function useBuddyMutation<V, R = void>(fn: (v: V) => Promise<R>) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: fn, onSuccess: () => qc.invalidateQueries({ queryKey: ['buddies'] }) });
}

export type FoundBuddy = { id: string; display_name: string; avatar_url: string | null; handle: string; relation: 'self' | 'accepted' | 'pending_out' | 'pending_in' | 'none'; interests: string[]; dogs: FriendDog[] };

/** Look someone up by public ID before asking them; null when nobody has that ID. */
export function useFindBuddy() {
  return useMutation({
    mutationFn: async (handle: string): Promise<FoundBuddy | null> => {
      const { data, error } = await supabase.rpc('find_friend_profile', { p_handle: handle });
      if (error) throw error;
      const found = (data as unknown as FoundBuddy[])[0];
      return found ? { ...found, interests: normalizeInterests(found.interests), dogs: found.dogs ?? [] } : null;
    },
  });
}

/** Ask someone by public ID; throws a message containing unknown_handle / self. */
export const useRequestBuddy = () =>
  useBuddyMutation(async (handle: string) => {
    const { error } = await supabase.rpc('request_buddy', { p_handle: handle });
    if (error) throw error;
  });

export const useRespondBuddy = () =>
  useBuddyMutation(async ({ from, accept }: { from: string; accept: boolean }) => {
    const { error } = await supabase.rpc('respond_buddy', { p_from: from, p_accept: accept });
    if (error) throw error;
  });

/** Remove a buddy, cancel my request, or (same thing) either side ending it. */
export function useRemoveBuddy() {
  const { userId } = useAuth();
  return useBuddyMutation(async (other: string) => {
    const { error } = await supabase.from('buddies').delete().or(`and(requester_id.eq.${userId},addressee_id.eq.${other}),and(requester_id.eq.${other},addressee_id.eq.${userId})`);
    if (error) throw error;
  });
}

/** Add these buddies (and, if asked, their dogs) to a trip I lead. */
export async function addBuddiesToTrip(tripId: string, buddyIds: string[], withDogs: boolean) {
  if (!buddyIds.length) return 0;
  const { data, error } = await supabase.rpc('add_buddies_to_trip', { p_trip: tripId, p_buddies: buddyIds, p_dogs: withDogs });
  if (error) throw error;
  return data as number;
}

export function useAddBuddiesToTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tripId, buddyIds, withDogs }: { tripId: string; buddyIds: string[]; withDogs: boolean }) => addBuddiesToTrip(tripId, buddyIds, withDogs),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['trip'] });
      qc.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}

export const RELATIONS = ['brother', 'sister', 'bestie', 'pal', 'lover', 'spouse', 'family', 'classmate', 'colleague', 'neighbor'] as const;

/** Set (or clear, with null) the label of the relationship; either side can do it. */
export const useSetBuddyRelation = () =>
  useBuddyMutation(async ({ other, relation }: { other: string; relation: string | null }) => {
    const { error } = await supabase.rpc('set_buddy_relation', { p_other: other, p_relation: relation ?? '' });
    if (error) throw error;
  });
