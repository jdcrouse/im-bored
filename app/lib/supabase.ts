import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const customFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  try {
    const response = await fetch(input, {
      ...init,
      headers: {
        'apikey': supabaseAnonKey,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
    return response;
  } catch (error) {
    console.error('Network request failed:', error);
    throw error;
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    fetch: customFetch,
  },
});