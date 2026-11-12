import { supabase } from './supabase';

/** Lowercase letters, digits and underscores, 3-20 characters. */
export const HANDLE_RE = /^[a-z0-9_]{3,20}$/;

/** Typing "Nick Dog!" gives "nickdog": lowercase and drop anything that is not allowed. */
export const cleanHandle = (v: string) => v.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 20);

/** Is this handle valid and free (ignoring the caller's own)? */
export async function handleAvailable(handle: string): Promise<boolean> {
  if (!HANDLE_RE.test(handle)) return false;
  const { data, error } = await supabase.rpc('handle_available', { p_handle: handle });
  if (error) throw error;
  return data === true;
}
