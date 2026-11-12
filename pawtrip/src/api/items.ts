import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useAuth } from '@/auth/AuthProvider';
import { buildItems, type DogMode, type ItemRow, type Mood, type Rsvp } from '@/features/plan/model';
import { supabase } from '@/lib/supabase';

const SELECT = '*, item_dogs(dog_id, mode, mood), reactions(user_id, vote, rsvp), comments(id, user_id, text, created_at)';

export function useItemRows(tripId: string | undefined) {
  return useQuery({
    queryKey: ['items', tripId],
    enabled: !!tripId,
    queryFn: async (): Promise<ItemRow[]> => {
      const { data, error } = await supabase.from('items').select(SELECT).eq('trip_id', tripId!);
      if (error) throw error;
      return data as unknown as ItemRow[];
    },
  });
}

/** Items of a trip as screen-ready views (day indexes, RSVP maps, ...). */
export function useItems(tripId: string | undefined, days: string[]) {
  const q = useItemRows(tripId);
  const items = useMemo(() => (q.data ? buildItems(q.data, days) : []), [q.data, days]);
  return { ...q, items };
}

export type NewItem = {
  trip_id: string;
  type: string;
  cat: string;
  title: string;
  emoji: string;
  addr?: string;
  notes?: string;
  date?: string | null;
  start_min?: number | null;
  end_min?: number | null;
  stay_from?: string | null;
  stay_to?: string | null;
  lat?: number | null;
  lon?: number | null;
};

type ItemPatch = Partial<Omit<NewItem, 'trip_id'>> & {
  confirmed?: boolean;
  deleted_at?: string | null;
  travel_min?: number | null;
};

function useItemMutation<V>(tripId: string | undefined, fn: (v: V) => Promise<unknown>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSettled: () => qc.invalidateQueries({ queryKey: ['items', tripId] }),
  });
}

export const useCreateItem = (tripId: string | undefined) =>
  useItemMutation(tripId, async (body: NewItem) => {
    const { data, error } = await supabase.from('items').insert(body).select('id').single();
    if (error) throw error;
    return data.id as string;
  });

export const usePatchItem = (tripId: string | undefined) =>
  useItemMutation(tripId, async ({ id, patch }: { id: string; patch: ItemPatch }) => {
    const { error } = await supabase.from('items').update(patch).eq('id', id);
    if (error) throw error;
  });

/** Soft delete / restore (the "Recently deleted" list restores). */
export const useSetDeleted = (tripId: string | undefined) =>
  useItemMutation(tripId, async ({ id, deleted }: { id: string; deleted: boolean }) => {
    const { error } = await supabase.from('items').update({ deleted_at: deleted ? new Date().toISOString() : null }).eq('id', id);
    if (error) throw error;
  });

export const useSetRsvp = (tripId: string | undefined) => {
  const { userId } = useAuth();
  return useItemMutation(tripId, async ({ itemId, rsvp }: { itemId: string; rsvp: Rsvp | null }) => {
    const { error } = await supabase
      .from('reactions')
      .upsert({ item_id: itemId, trip_id: tripId!, user_id: userId!, rsvp }, { onConflict: 'item_id,user_id' });
    if (error) throw error;
  });
};

export const useSetDogMode = (tripId: string | undefined) =>
  useItemMutation(tripId, async ({ itemId, dogId, mode }: { itemId: string; dogId: string; mode: DogMode }) => {
    const { error } = await supabase
      .from('item_dogs')
      .upsert({ item_id: itemId, trip_id: tripId!, dog_id: dogId, mode }, { onConflict: 'item_id,dog_id' });
    if (error) throw error;
  });

export const useSetMood = (tripId: string | undefined) =>
  useItemMutation(tripId, async ({ itemId, dogId, mood }: { itemId: string; dogId: string; mood: Mood | null }) => {
    const { error } = await supabase.from('item_dogs').update({ mood }).eq('item_id', itemId).eq('dog_id', dogId);
    if (error) throw error;
  });

export const useAddComment = (tripId: string | undefined) =>
  useItemMutation(tripId, async ({ itemId, text }: { itemId: string; text: string }) => {
    const { error } = await supabase.from('comments').insert({ item_id: itemId, trip_id: tripId!, text });
    if (error) throw error;
  });
