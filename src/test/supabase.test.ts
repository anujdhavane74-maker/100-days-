import { describe, it, expect, beforeEach } from 'vitest';
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  clearSupabaseConfig,
  getSupabaseClient,
  SUPABASE_SQL_SCHEMA,
} from '../services/supabase';

describe('Supabase Client and Credentials Management', () => {
  beforeEach(() => {
    clearSupabaseConfig();
  });

  it('provides configured Supabase credentials by default', () => {
    const config = getSupabaseConfig();
    expect(config.url).toContain('supabase.co');
    expect(config.anonKey).toBeTruthy();
    expect(getSupabaseClient()).not.toBeNull();
  });

  it('persists and retrieves custom Supabase credentials from localStorage', () => {
    saveSupabaseConfig('https://testproject.supabase.co', 'test-anon-key-123');
    const config = getSupabaseConfig();

    expect(config.url).toBe('https://testproject.supabase.co');
    expect(config.anonKey).toBe('test-anon-key-123');

    const client = getSupabaseClient();
    expect(client).not.toBeNull();
  });

  it('clears custom Supabase credentials cleanly back to defaults', () => {
    saveSupabaseConfig('https://custom-override.supabase.co', 'custom-key-123');
    clearSupabaseConfig();
    const config = getSupabaseConfig();

    expect(config.url).not.toBe('https://custom-override.supabase.co');
    expect(config.anonKey).not.toBe('custom-key-123');
    expect(config.url).toContain('supabase.co');
  });

  it('contains the valid SQL table schema definition with RLS policies', () => {
    expect(SUPABASE_SQL_SCHEMA).toContain('growth_tracker_data');
    expect(SUPABASE_SQL_SCHEMA).toContain('enable row level security');
    expect(SUPABASE_SQL_SCHEMA).toContain('auth.uid() = user_id');
  });
});

