import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

import type { Database } from './database.types';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_KEY;
if (!url || !key) {
  throw new Error('Missing EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_KEY (see .env.example)');
}

// Expo web renders on a Node server first (`web.output: "server"`), where there is no window / storage.
const isServer = typeof window === 'undefined';
const memoryStorage = { getItem: async () => null, setItem: async () => {}, removeItem: async () => {} };

export const supabase = createClient<Database>(url, key, {
  auth: {
    storage: isServer ? memoryStorage : AsyncStorage,
    autoRefreshToken: !isServer,
    persistSession: !isServer,
    // On the web the magic-link / OAuth redirect carries the session in the URL.
    detectSessionInUrl: Platform.OS === 'web' && !isServer,
  },
});

// Native: only refresh tokens while the app is in the foreground.
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}
