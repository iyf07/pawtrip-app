import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/auth/AuthProvider';
import { supabase } from '@/lib/supabase';

type PersonLite = { display_name: string; avatar_url: string | null; handle: string };
export type BuddyMember = { user_id: string; status: 'invited' | 'accepted'; profiles: PersonLite | null };
export type BuddyGroup = { id: string; name: string; owner_id: string; created_at: string; buddy_members: BuddyMember[] };

/** My buddy groups, including the ones I was invited to but have not answered. */
export function useBuddyGroups() {
  const { userId } = useAuth();
  return useQuery({
    queryKey: ['buddies', userId],
    enabled: !!userId,
    queryFn: async (): Promise<BuddyGroup[]> => {
      const { data, error } = await supabase
        .from('buddy_groups')
        .select('*, buddy_members(user_id, status, profiles(display_name, avatar_url, handle))')
        .order('created_at');
      if (error) throw error;
      return data as unknown as BuddyGroup[];
    },
  });
}

function useBuddyMutation<V, R = void>(fn: (v: V) => Promise<R>) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: fn, onSuccess: () => qc.invalidateQueries({ queryKey: ['buddies'] }) });
}

export const useCreateBuddyGroup = () =>
  useBuddyMutation(async (name: string) => {
    const { error } = await supabase.from('buddy_groups').insert({ name: name.trim() });
    if (error) throw error;
  });

export const useDeleteBuddyGroup = () =>
  useBuddyMutation(async (id: string) => {
    const { error } = await supabase.from('buddy_groups').delete().eq('id', id);
    if (error) throw error;
  });

/** Invite by public ID; throws a message containing unknown_handle / self / group_full. */
export const useInviteBuddy = () =>
  useBuddyMutation(async ({ group, handle }: { group: string; handle: string }) => {
    const { error } = await supabase.rpc('invite_buddy', { p_group: group, p_handle: handle });
    if (error) throw error;
  });

export const useRespondBuddy = () =>
  useBuddyMutation(async ({ group, accept }: { group: string; accept: boolean }) => {
    const { error } = await supabase.rpc('respond_buddy', { p_group: group, p_accept: accept });
    if (error) throw error;
  });

/** Leave a group, or (as the owner) remove someone: both delete one membership row. */
export const useRemoveBuddy = () =>
  useBuddyMutation(async ({ group, user }: { group: string; user: string }) => {
    const { error } = await supabase.from('buddy_members').delete().eq('group_id', group).eq('user_id', user);
    if (error) throw error;
  });

/** Add everyone who accepted in these groups (and their dogs) to a trip I lead. */
export async function addBuddiesToTrip(tripId: string, groupIds: string[], withDogs: boolean) {
  for (const g of groupIds) {
    const { error } = await supabase.rpc('add_buddies_to_trip', { p_trip: tripId, p_group: g, p_dogs: withDogs });
    if (error) throw error;
  }
}
