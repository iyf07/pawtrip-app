import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/auth/AuthProvider';
import { supabase } from '@/lib/supabase';

export type AppNotification = {
  id: string;
  kind: 'friend_accepted' | 'friend_declined' | 'relation_accepted' | 'relation_declined';
  actorId: string | null;
  actorName: string;
  actorAvatar: string | null;
  relation: string | null;
  createdAt: string;
};

/** Unread answers to things I asked (friend requests, relationship labels). */
export function useNotifications() {
  const { userId } = useAuth();
  return useQuery({
    queryKey: ['notifications', userId],
    enabled: !!userId,
    refetchInterval: 60_000,
    queryFn: async (): Promise<AppNotification[]> => {
      const { data, error } = await supabase.from('notifications').select('*').is('read_at', null).order('created_at', { ascending: false });
      if (error) throw error;
      return data.map((n) => ({
        id: n.id,
        kind: n.kind as AppNotification['kind'],
        actorId: n.actor_id,
        actorName: n.actor_name,
        actorAvatar: n.actor_avatar,
        relation: n.relation,
        createdAt: n.created_at,
      }));
    },
  });
}

export function useDismissNotification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.rpc('dismiss_notification', { p_id: id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
}
