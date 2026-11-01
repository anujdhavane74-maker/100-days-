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

  it('provides empty credentials by default when not configured', () => {
    const config = getSupabaseConfig();
    expect(config.url).toBe('');
    expect(config.anonKey).toBe('');
    expect(getSupabaseClient()).toBeNull();
  });

  it('persists and retrieves custom Supabase credentials from localStorage', () => {
    saveSupabaseConfig('https://testproject.supabase.co', 'test-anon-key-123');
    const config = getSupabaseConfig();

    expect(config.url).toBe('https://testproject.supabase.co');
    expect(config.anonKey).toBe('test-anon-key-123');

    const client = getSupabaseClient();
    expect(client).not.toBeNull();
  });

  it('clears Supabase credentials cleanly', () => {
    saveSupabaseConfig('https://testproject.supabase.co', 'test-anon-key-123');
    clearSupabaseConfig();
    const config = getSupabaseConfig();

    expect(config.url).toBe('');
    expect(config.anonKey).toBe('');
  });

  it('contains the valid SQL table schema definition with RLS policies', () => {
    expect(SUPABASE_SQL_SCHEMA).toContain('growth_tracker_data');
    expect(SUPABASE_SQL_SCHEMA).toContain('enable row level security');
    expect(SUPABASE_SQL_SCHEMA).toContain('auth.uid() = user_id');
  });
});
