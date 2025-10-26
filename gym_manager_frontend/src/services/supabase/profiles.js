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
 * create - Create a profile record for a user id. Includes role and status.
 * Default status: 'active' unless role === 'trainer' then 'pending'.
 */
export async function create({ id, name, email, role }) {
  assertSupabaseReady();
  const status = role === 'trainer' ? 'pending' : 'active';
  const payload = { id, name, email, role, status };
  const result = await supabase.from(tableNames.profiles).insert(payload).select().single();
  const { data } = handle(result, 'create profile');
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

/**
 * PUBLIC_INTERFACE
 * ownerExists - Returns true if a profile with role 'owner' exists.
 */
export async function ownerExists() {
  assertSupabaseReady();
  const result = await supabase.from(tableNames.profiles).select('id', { count: 'exact', head: false }).eq('role', 'owner').limit(1);
  const { data } = handle(result, 'check owner exists');
  return Array.isArray(data) && data.length > 0;
}

/**
 * PUBLIC_INTERFACE
 * listTrainersByStatus - Returns trainers filtered by status (pending|active|rejected).
 */
export async function listTrainersByStatus(status = 'pending') {
  assertSupabaseReady();
  const result = await supabase
    .from(tableNames.profiles)
    .select('*')
    .eq('role', 'trainer')
    .eq('status', status)
    .order('created_at', { ascending: false });
  const { data } = handle(result, 'list trainers by status');
  return data || [];
}

/**
 * PUBLIC_INTERFACE
 * approveTrainer - Set trainer status to 'active'.
 */
export async function approveTrainer(id) {
  return update(id, { status: 'active' });
}

/**
 * PUBLIC_INTERFACE
 * rejectTrainer - Set trainer status to 'rejected'.
 */
export async function rejectTrainer(id) {
  return update(id, { status: 'rejected' });
}
