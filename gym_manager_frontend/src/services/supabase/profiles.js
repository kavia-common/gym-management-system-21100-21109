import { supabase } from '../../lib/supabaseClient';
import { assertSupabaseReady, handle, tableNames } from './helpers';

/**
 * PUBLIC_INTERFACE
 * getById - Fetch a profile by id.
 */
export async function getById(id) {
  assertSupabaseReady();
  const result = await supabase.from(tableNames.profiles).select('*').eq('id', id).single();
  const { data } = handle(result, 'get profile');
  return data;
}

/**
 * PUBLIC_INTERFACE
 * update - Update profile by id.
 */
export async function update(id, patch) {
  assertSupabaseReady();
  const result = await supabase.from(tableNames.profiles).update(patch).eq('id', id).select().single();
  const { data } = handle(result, 'update profile');
  return data;
}

/**
 * PUBLIC_INTERFACE
 * getCurrent - Helper to get current authenticated user's profile via auth session.
 */
export async function getCurrent() {
  assertSupabaseReady();
  const { data: authData, error: authErr } = await supabase.auth.getUser();
  if (authErr) throw new Error(authErr.message || 'Failed to read auth user');
  const userId = authData?.user?.id;
  if (!userId) throw new Error('No authenticated user');
  return getById(userId);
}
