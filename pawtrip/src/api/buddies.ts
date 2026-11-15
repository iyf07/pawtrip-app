import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/auth/AuthProvider';
import { supabase } from '@/lib/supabase';
import { personScales, type PersonScale } from '@/constants/options';

export type Buddy = {
  /** the other person */
  userId: string;
  status: 'pending' | 'accepted';
  /** a pending request: did I send it, or did they send it to me? */
  incoming: boolean;
  name: string;
  avatar: string | null;
  handle: string;
  traits: Record<PersonScale, number | null>;
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
      const { data: profs, error: e2 } = await supabase.from('profiles').select('id, display_name, avatar_url, handle, morning, noise, walking, temperature, pace, spending').in('id', others.map((o) => o.other));
      if (e2) throw e2;
      const byId = new Map(profs.map((p) => [p.id, p]));
      return others.map(({ r, other }) => ({
        userId: other,
        status: r.status as Buddy['status'],
        incoming: r.addressee_id === userId,
        name: byId.get(other)?.display_name ?? '?',
        avatar: byId.get(other)?.avatar_url ?? null,
        handle: byId.get(other)?.handle ?? '',
        traits: personScales(byId.get(other) ?? {}),
      }));
    },
  });
}

function useBuddyMutation<V, R = void>(fn: (v: V) => Promise<R>) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: fn, onSuccess: () => qc.invalidateQueries({ queryKey: ['buddies'] }) });
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
