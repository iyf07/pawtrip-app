import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/auth/AuthProvider';
import { supabase } from '@/lib/supabase';

export type FamilyMember = { userId: string; name: string; avatar: string | null; handle: string; role: 'admin' | 'member'; status: 'pending' | 'accepted' };
export type FamilyInvite = { familyId: string; familyName: string; inviterName: string };
export type FamilyState = {
  /** the family I belong to (accepted), if any */
  family: { id: string; name: string } | null;
  members: FamilyMember[];
  isAdmin: boolean;
  /** invitations waiting for my answer */
  invites: FamilyInvite[];
};

/** My family, its members (and open invitations) and the invitations sent to me. */
export function useFamily() {
  const { userId } = useAuth();
  return useQuery({
    queryKey: ['family', userId],
    enabled: !!userId,
    queryFn: async (): Promise<FamilyState> => {
      const { data: rows, error } = await supabase.from('family_members').select('*').order('created_at');
      if (error) throw error;
      if (!rows.length) return { family: null, members: [], isAdmin: false, invites: [] };
      const [{ data: fams, error: e1 }, { data: profs, error: e2 }] = await Promise.all([
        supabase.from('families').select('id, name').in('id', [...new Set(rows.map((r) => r.family_id))]),
        supabase.from('profiles').select('id, display_name, avatar_url, handle').in('id', [...new Set(rows.flatMap((r) => [r.user_id, r.invited_by].filter((x): x is string => !!x)))]),
      ]);
      if (e1) throw e1;
      if (e2) throw e2;
      const prof = new Map((profs ?? []).map((p) => [p.id, p]));
      const fam = new Map((fams ?? []).map((f) => [f.id, f]));
      const mine = rows.find((r) => r.user_id === userId && r.status === 'accepted');
      const invites = rows
        .filter((r) => r.user_id === userId && r.status === 'pending')
        .map((r) => ({ familyId: r.family_id, familyName: fam.get(r.family_id)?.name ?? '', inviterName: prof.get(r.invited_by ?? '')?.display_name ?? '?' }));
      const members = mine
        ? rows
            .filter((r) => r.family_id === mine.family_id)
            .map((r): FamilyMember => ({ userId: r.user_id, name: prof.get(r.user_id)?.display_name ?? '?', avatar: prof.get(r.user_id)?.avatar_url ?? null, handle: prof.get(r.user_id)?.handle ?? '', role: r.role as FamilyMember['role'], status: r.status as FamilyMember['status'] }))
            .sort((a, b) => Number(a.status === 'pending') - Number(b.status === 'pending'))
        : [];
      return { family: mine ? { id: mine.family_id, name: fam.get(mine.family_id)?.name ?? '' } : null, members, isAdmin: mine?.role === 'admin', invites };
    },
  });
}

function useFamilyMutation<V>(fn: (v: V) => Promise<void>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      // sharing dogs changes with membership
      for (const key of ['family', 'dogs', 'dog', 'buddies']) qc.invalidateQueries({ queryKey: [key] });
    },
  });
}

export const useCreateFamily = () =>
  useFamilyMutation(async (name: string) => {
    const { error } = await supabase.rpc('create_family', { p_name: name });
    if (error) throw error;
  });

export const useRenameFamily = () =>
  useFamilyMutation(async (name: string) => {
    const { error } = await supabase.rpc('rename_family', { p_name: name });
    if (error) throw error;
  });

export const useInviteToFamily = () =>
  useFamilyMutation(async (userId: string) => {
    const { error } = await supabase.rpc('invite_to_family', { p_user: userId });
    if (error) throw error;
  });

export const useRespondFamilyInvite = () =>
  useFamilyMutation(async ({ familyId, accept }: { familyId: string; accept: boolean }) => {
    const { error } = await supabase.rpc('respond_family_invite', { p_family: familyId, p_accept: accept });
    if (error) throw error;
  });

export const useRemoveFamilyMember = () =>
  useFamilyMutation(async (userId: string) => {
    const { error } = await supabase.rpc('remove_family_member', { p_user: userId });
    if (error) throw error;
  });

export const useLeaveFamily = () =>
  useFamilyMutation(async () => {
    const { error } = await supabase.rpc('leave_family');
    if (error) throw error;
  });

export type FamilyPreview = { name: string; members: number; expired: boolean; already_in_family: boolean };

/** Look a family up by its invite code before joining; null when no family has that code. */
export async function peekFamily(code: string): Promise<FamilyPreview | null> {
  const { data, error } = await supabase.rpc('peek_family', { p_code: code });
  if (error) throw error;
  return (data as unknown as FamilyPreview | null) ?? null;
}

export const useJoinFamily = () =>
  useFamilyMutation(async (code: string) => {
    const { error } = await supabase.rpc('join_family', { p_code: code });
    if (error) throw error;
  });

/** Admin: a brand-new code (valid one hour); every call replaces the previous one. */
export function useRotateFamilyCode() {
  return useMutation({
    mutationFn: async (): Promise<{ code: string; expires: string }> => {
      const { data, error } = await supabase.rpc('rotate_family_code');
      if (error) throw error;
      return data as unknown as { code: string; expires: string };
    },
  });
}

/** Admin: close the family for everyone (dogs and trips stay). */
export const useDisbandFamily = () =>
  useFamilyMutation(async () => {
    const { error } = await supabase.rpc('disband_family');
    if (error) throw error;
  });
