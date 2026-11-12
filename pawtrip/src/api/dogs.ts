import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/auth/AuthProvider';
import { supabase } from '@/lib/supabase';

import type { Dog, DogInsert } from './types';

export const DOG_SCALES = ['energy', 'temp', 'with_dogs', 'with_people', 'alone', 'car'] as const;
export type DogScale = (typeof DOG_SCALES)[number];

export function useMyDogs() {
  const { userId } = useAuth();
  return useQuery({
    queryKey: ['dogs', userId],
    enabled: !!userId,
    queryFn: async (): Promise<Dog[]> => {
      const { data, error } = await supabase.from('dogs').select('*').eq('owner_id', userId!).order('created_at');
      if (error) throw error;
      return data;
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
    mutationFn: async ({ id, ...body }: Omit<DogInsert, 'owner_id'> & { id?: string }): Promise<Dog> => {
      const q = id
        ? supabase.from('dogs').update(body).eq('id', id)
        : supabase.from('dogs').insert(body);
      const { data, error } = await q.select('*').single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
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
      qc.invalidateQueries({ queryKey: ['dogs'] });
      qc.invalidateQueries({ queryKey: ['trip'] });
      qc.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}
