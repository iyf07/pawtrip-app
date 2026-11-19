import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

export type Suggestion = { title: string; why: string; cat: string; when: string | null };
type Result = { items: Suggestion[]; cached: boolean };

async function ask(tripId: string, date: string, lang: 'zh' | 'en', force: boolean): Promise<Result> {
  const { data, error } = await supabase.functions.invoke('recommend', { body: { tripId, date, lang, ...(force ? { force: true } : {}) } });
  if (error) throw error;
  return data as Result;
}

/** Gemini's ideas for one trip day. The server caches per trip day, so opening Home again does not call the model. */
export function useRecommendations(tripId: string | undefined, date: string | undefined, lang: 'zh' | 'en') {
  const qc = useQueryClient();
  const key = ['recommend', tripId, date, lang];
  const q = useQuery({ queryKey: key, enabled: !!tripId && !!date, retry: false, staleTime: 6 * 3600_000, queryFn: () => ask(tripId!, date!, lang, false) });
  const refresh = useMutation({ mutationFn: () => ask(tripId!, date!, lang, true), onSuccess: (d) => qc.setQueryData(key, d) });
  return { ...q, refresh };
}
