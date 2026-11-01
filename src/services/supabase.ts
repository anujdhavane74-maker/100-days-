import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { AppState } from '../types';

const STORAGE_SUPABASE_URL_KEY = 'growth_tracker_supabase_url';
const STORAGE_SUPABASE_KEY_KEY = 'growth_tracker_supabase_anon_key';

const DEFAULT_SUPABASE_URL = 'https://juygiovirtyxnljdomxg.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_InXoJDV8KdGDLBfdaP1JZA_bCcB3PMP';

/**
 * Retrieves configured Supabase credentials from environment, localStorage, or pre-configured defaults.
 */
export function getSupabaseConfig(): { url: string; anonKey: string } {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  let storedUrl = '';
  let storedKey = '';
  try {
    storedUrl = localStorage.getItem(STORAGE_SUPABASE_URL_KEY) || '';
    storedKey = localStorage.getItem(STORAGE_SUPABASE_KEY_KEY) || '';
  } catch {
    // Ignore storage errors
  }

  return {
    url: storedUrl || envUrl || DEFAULT_SUPABASE_URL,
    anonKey: storedKey || envKey || DEFAULT_SUPABASE_KEY,
  };
}

/**
 * Saves custom Supabase credentials to localStorage.
 */
export function saveSupabaseConfig(url: string, anonKey: string): void {
  try {
    localStorage.setItem(STORAGE_SUPABASE_URL_KEY, url.trim());
    localStorage.setItem(STORAGE_SUPABASE_KEY_KEY, anonKey.trim());
  } catch (err) {
    console.error('Failed to save Supabase config to localStorage:', err);
  }
}

/**
 * Clears custom Supabase credentials from localStorage.
 */
export function clearSupabaseConfig(): void {
  try {
    localStorage.removeItem(STORAGE_SUPABASE_URL_KEY);
    localStorage.removeItem(STORAGE_SUPABASE_KEY_KEY);
  } catch (err) {
    console.error('Failed to clear Supabase config from localStorage:', err);
  }
}

let cachedClient: SupabaseClient | null = null;
let currentConfigString = '';

/**
 * Returns an active Supabase client instance if configured.
 */
export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config.url || !config.anonKey) {
    return null;
  }

  const configString = `${config.url}::${config.anonKey}`;
  if (cachedClient && currentConfigString === configString) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    currentConfigString = configString;
    return cachedClient;
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    return null;
  }
}

/**
 * Fetches user's tracker state from Supabase table 'growth_tracker_data'.
 */
export async function fetchCloudTrackerState(userId: string): Promise<AppState | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('growth_tracker_data')
      .select('state_json, updated_at')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Cloud state fetch warning:', error.message);
      return null;
    }

    if (data && data.state_json) {
      return data.state_json as AppState;
    }
  } catch (err) {
    console.warn('Error fetching cloud tracker state:', err);
  }

  return null;
}

/**
 * Saves or updates user's tracker state to Supabase table 'growth_tracker_data'.
 */
export async function saveCloudTrackerState(userId: string, state: AppState): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const payload = {
      user_id: userId,
      state_json: state,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('growth_tracker_data')
      .upsert(payload, { onConflict: 'user_id' });

    if (error) {
      console.error('Cloud state save error:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error saving tracker state to cloud:', err);
    return false;
  }
}

/**
 * SQL Schema migration statement for user's Supabase dashboard.
 */
export const SUPABASE_SQL_SCHEMA = `-- Run this in your Supabase SQL Editor:
create table if not exists public.growth_tracker_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state_json jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.growth_tracker_data enable row level security;

create policy "Users can read own tracker data"
  on public.growth_tracker_data for select
  using (auth.uid() = user_id);

create policy "Users can insert/update own tracker data"
  on public.growth_tracker_data for all
  using (auth.uid() = user_id);
`;

