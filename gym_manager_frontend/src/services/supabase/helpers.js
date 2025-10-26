import supabase from '../../lib/supabaseClient';
import { config } from '../../config';

/**
 * PUBLIC_INTERFACE
 * tableNames - Centralized Supabase table name constants.
 */
export const tableNames = {
  members: 'members',
  trainers: 'trainers',
  classes: 'classes',
  bookings: 'bookings',
  programs: 'programs',
  payments: 'payments',
  profiles: 'profiles', // generic user profile table if present
};

/**
 * PUBLIC_INTERFACE
 * assertSupabaseReady - Throws if Supabase is not initialized.
 */
export function assertSupabaseReady() {
  if (!supabase || config.useMocks) {
    throw new Error('[Supabase] Client unavailable or mock mode enabled. Disable mocks and set REACT_APP_SUPABASE_URL/REACT_APP_SUPABASE_ANON_KEY.');
  }
}

/**
 * PUBLIC_INTERFACE
 * paginate - Builds range parameters and returns normalized pagination meta.
 */
export function paginate({ page = 1, limit = 20 } = {}) {
  const p = Math.max(1, Number(page) || 1);
  const l = Math.min(100, Math.max(1, Number(limit) || 20));
  const from = (p - 1) * l;
  const to = from + l - 1;
  return { from, to, meta: { page: p, limit: l } };
}

/**
 * PUBLIC_INTERFACE
 * handle - Standard Supabase error handling wrapper.
 */
export function handle(result, action = 'operation') {
  const { data, error, count } = result || {};
  if (error) {
    const err = new Error(error.message || `Supabase ${action} failed`);
    err.code = error.code;
    err.details = error.details;
    throw err;
  }
  return { data, count };
}

/**
 * PUBLIC_INTERFACE
 * withCount - Helper to add count: 'exact' to a query for total records.
 */
export function withCount(query) {
  // Some queries (select) can request a count for pagination
  return query.select('*', { count: 'exact' });
}
