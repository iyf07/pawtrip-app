import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { useAuth } from '@/auth/AuthProvider';
import { supabase } from '@/lib/supabase';

export type FeedbackKind = 'bug' | 'idea' | 'other';

/**
 * Browsers hide the exact phone model (Safari reports just "iPhone"), so describe what shapes the layout:
 * OS, browser, window and screen size, pixel ratio, orientation, installed-app mode, colour scheme.
 */
function webPlatform() {
  const ua = navigator.userAgent;
  const os = /iPhone/.test(ua) ? 'iPhone' : /iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) ? 'iPad' : /Android/.test(ua) ? 'Android' : /Mac OS X/.test(ua) ? 'Mac' : /Windows/.test(ua) ? 'Windows' : /Linux/.test(ua) ? 'Linux' : 'other';
  const osVer = (/(?:OS|Android|Mac OS X) ([\d._]+)/.exec(ua)?.[1] ?? '').replace(/_/g, '.');
  const browser = /Edg\//.test(ua) ? 'Edge' : /(CriOS|Chrome)\//.test(ua) ? 'Chrome' : /(FxiOS|Firefox)\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'browser';
  const android = /Android [\d.]+; ([^;)]+)/.exec(ua)?.[1]; // Android UAs often include the model
  const mq = (q: string) => typeof window.matchMedia === 'function' && window.matchMedia(q).matches;
  const parts = [
    `web ${os}${osVer ? ' ' + osVer : ''}${android ? ' ' + android : ''} · ${browser}`,
    `viewport ${window.innerWidth}x${window.innerHeight}`,
    `screen ${screen.width}x${screen.height}@${window.devicePixelRatio}x`,
    window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
    mq('(display-mode: standalone)') || (navigator as { standalone?: boolean }).standalone ? 'home-screen app' : 'in browser',
    mq('(prefers-color-scheme: dark)') ? 'system dark' : 'system light',
    navigator.maxTouchPoints > 0 ? 'touch' : 'mouse',
  ];
  return `${parts.join(' · ')} · UA ${ua}`;
}

/** What the user was doing, so a report can be reproduced. Never includes the email. */
export function feedbackContext() {
  const version = Constants.expoConfig?.version ?? '0';
  const commit = process.env.EXPO_PUBLIC_APP_COMMIT || 'dev';
  const platform = Platform.OS === 'web' && typeof navigator !== 'undefined' ? webPlatform() : `${Platform.OS} ${String(Platform.Version)}`;
  return { app_version: `${version}+${commit}`, platform: platform.slice(0, 400) };
}

type Submit = { kind: FeedbackKind; message: string; route: string; lang: 'zh' | 'en'; screenshotUri?: string | null };

export function useSubmitFeedback() {
  const { userId } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (v: Submit) => {
      let screenshot_path: string | null = null;
      if (v.screenshotUri) {
        const bytes = await (await fetch(v.screenshotUri)).arrayBuffer();
        const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
        const { error: upErr } = await supabase.storage.from('feedback').upload(path, bytes, { contentType: 'image/jpeg' });
        if (upErr) throw upErr;
        screenshot_path = path;
      }
      const { error } = await supabase.from('feedback').insert({
        kind: v.kind,
        message: v.message.trim().slice(0, 2000),
        route: v.route.slice(0, 300),
        lang: v.lang,
        screenshot_path,
        ...feedbackContext(),
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['feedback'] }),
  });
}

export function useMyFeedback() {
  const { userId } = useAuth();
  return useQuery({
    queryKey: ['feedback', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from('feedback').select('id, kind, message, status, resolution, created_at').order('created_at', { ascending: false }).limit(20);
      if (error) throw error;
      return data;
    },
  });
}
