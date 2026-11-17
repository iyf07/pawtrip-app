import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/auth/AuthProvider';
import { supabase } from '@/lib/supabase';

import type { Dog, DogInsert } from './types';

type DogFields = Omit<DogInsert, 'owner_id' | 'id'>;
type DogSaveInput = (DogFields & { id?: undefined }) | (Partial<DogFields> & { id: string });

export { DOG_SCALES, type DogScale } from '@/constants/options';

/** My dogs, then the dogs of my family (accepted members share theirs). */
export function useMyDogs() {
  const { userId } = useAuth();
  return useQuery({
    queryKey: ['dogs', userId],
    enabled: !!userId,
    queryFn: async (): Promise<Dog[]> => {
      const { data: mine, error: e0 } = await supabase.from('family_members').select('family_id').eq('user_id', userId!).eq('status', 'accepted').maybeSingle();
      if (e0) throw e0;
      const { data: mates, error: e1 } = mine
        ? await supabase.from('family_members').select('user_id').eq('family_id', mine.family_id).eq('status', 'accepted').neq('user_id', userId!)
        : { data: [], error: null };
      if (e1) throw e1;
      const owners = [userId!, ...(mates ?? []).map((m) => m.user_id)];
      const { data, error } = await supabase.from('dogs').select('*').in('owner_id', owners).order('created_at');
      if (error) throw error;
      return [...data.filter((d) => d.owner_id === userId), ...data.filter((d) => d.owner_id !== userId)];
    },
  });
}

export function useDog(id: string | undefined) {
  return useQuery({
    queryKey: ['dog', id],
    enabled: !!id && id !== 'new',
    queryFn: async (): Promise<Dog> => {
      const { data, error } = await supabase.from('dogs').select('*').eq('id', id!).single();
      if (error) throw error;
      return data;
    },
  });
}

export function useSaveDog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }: DogSaveInput): Promise<Dog> => {
      const q = id
        ? supabase.from('dogs').update(body).eq('id', id)
        : supabase.from('dogs').insert(body as DogFields);
      const { data, error } = await q.select('*').single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['buddies'] });
      qc.invalidateQueries({ queryKey: ['dogs'] });
      qc.invalidateQueries({ queryKey: ['dog'] });
      qc.invalidateQueries({ queryKey: ['trip'] });
      qc.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}

export function useDeleteDog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('dogs').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['buddies'] });
      qc.invalidateQueries({ queryKey: ['dogs'] });
      qc.invalidateQueries({ queryKey: ['trip'] });
      qc.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}
