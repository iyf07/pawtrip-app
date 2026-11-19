import type { Session } from '@supabase/supabase-js';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';

import { supabase } from '@/lib/supabase';
import { parseLoginIdentifier } from '@/lib/login-identifier';

type AuthCtx = {
  session: Session | null;
  /** false until the stored session has been read */
  ready: boolean;
  userId: string | null;
  email: string | null;
  /** Request an email OTP using an email address or public ID. */
  sendCode: (identifier: string) => Promise<void>;
  verifyCode: (identifier: string, code: string) => Promise<void>;
  /** Web: continue with a Google account (Supabase OAuth); the page navigates to Google and comes back signed in. */
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      // the library repeats SIGNED_IN whenever the tab regains focus: keep the same object so the whole app does not re-render
      setSession((cur) => (cur && s && cur.access_token === s.access_token && cur.user.id === s.user.id ? cur : s));
      setReady(true);
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const sendCode = useCallback(async (identifier: string) => {
    const id = parseLoginIdentifier(identifier);
    if (!id) throw new Error('invalid_identifier');
    const redirectTo = Platform.OS === 'web' ? window.location.origin : 'pawtrip://';
    if (id.kind === 'email') {
      const { error } = await supabase.auth.signInWithOtp({ email: id.value, options: { shouldCreateUser: true, emailRedirectTo: redirectTo } });
      if (error) throw error;
    } else {
      const { data, error } = await supabase.functions.invoke('id-login', { body: { action: 'send', identifier: id.value, redirectTo } });
      if (error || data?.accepted !== true) throw error ?? new Error('send_failed');
    }
  }, []);

  const verifyCode = useCallback(async (identifier: string, code: string) => {
    const id = parseLoginIdentifier(identifier);
    if (!id) throw new Error('invalid_identifier');
    if (id.kind === 'email') {
      const { error } = await supabase.auth.verifyOtp({ email: id.value, token: code.trim(), type: 'email' });
      if (error) throw error;
    } else {
      const { data, error } = await supabase.functions.invoke('id-login', { body: { action: 'verify', identifier: id.value, token: code.trim() } });
      if (error || !data?.session?.access_token || !data?.session?.refresh_token) throw error ?? new Error('invalid_code');
      const { error: sessionError } = await supabase.auth.setSession(data.session);
      if (sessionError) throw sessionError;
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (Platform.OS !== 'web') throw new Error('google_web_only');
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({
      session,
      ready,
      userId: session?.user.id ?? null,
      email: session?.user.email ?? null,
      sendCode,
      verifyCode,
      signInWithGoogle,
      signOut,
    }),
    [session, ready, sendCode, verifyCode, signInWithGoogle, signOut],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used inside <AuthProvider>');
  return v;
}
