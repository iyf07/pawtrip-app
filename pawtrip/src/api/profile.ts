import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/auth/AuthProvider';
import { supabase } from '@/lib/supabase';

import type { Profile } from './types';

export function useMyProfile() {
  const { userId } = useAuth();
  return useQuery({
    queryKey: ['profile', userId],
    enabled: !!userId,
    queryFn: async (): Promise<Profile> => {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId!).single();
      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateProfile() {
  const { userId } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Partial<Pick<Profile, 'display_name' | 'avatar_url' | 'interests' | 'diet' | 'walking' | 'noise' | 'morning'>>) => {
      const { error } = await supabase.from('profiles').update(patch).eq('id', userId!);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile', userId] }),
  });
}

/** Best-effort sync of the chosen language to the account (the app also keeps it locally). */
export async function saveLangSetting(userId: string, lang: 'zh' | 'en') {
  await supabase.from('user_settings').update({ lang }).eq('id', userId);
}

export type TempUnit = 'F' | 'C';

/** Private display settings (temperature unit, ...). */
export function useSettings() {
  const { userId } = useAuth();
  return useQuery({
    queryKey: ['settings', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from('user_settings').select('*').eq('id', userId!).single();
      if (error) throw error;
      return data;
    },
  });
}

export function useSetTempUnit() {
  const { userId } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (unit: TempUnit) => {
      const { error } = await supabase.from('user_settings').update({ temp_unit: unit }).eq('id', userId!);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings', userId] }),
  });
}
