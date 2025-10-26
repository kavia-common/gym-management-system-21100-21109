import supabase from '../../lib/supabaseClient';

// Re-export client for convenience in consumers that import from helpers
export { default as supabase } from '../../lib/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * tableNames - Centralized table name mapping to avoid typos across services.
 */
export const tableNames = {
  bookings: 'bookings',
  classes: 'classes',
  members: 'members',
  payments: 'payments',
  profiles: 'profiles',
  programs: 'programs',
  trainers: 'trainers',
};

/**
 * PUBLIC_INTERFACE
 * assertSupabaseReady - Throws a helpful error if env vars are missing.
 */
export function assertSupabaseReady() {
  const craUrl = process?.env?.REACT_APP_SUPABASE_URL;
  const craKey = process?.env?.REACT_APP_SUPABASE_ANON_KEY;
  const viteUrl = import.meta?.env?.VITE_SUPABASE_URL || process?.env?.VITE_SUPABASE_URL;
  const viteKey = import.meta?.env?.VITE_SUPABASE_ANON_KEY || process?.env?.VITE_SUPABASE_ANON_KEY;
  const hasCra = !!(craUrl && craKey);
  const hasVite = !!(viteUrl && viteKey);
  if (!hasCra && !hasVite) {
    throw new Error(
      'Supabase is not configured. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY (CRA) or VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (Vite) in your .env file.'
    );
  }
}

/**
 * PUBLIC_INTERFACE
 * handle - Normalizes Supabase responses and throws errors with context.
 */
export function handle(result, context = 'operation') {
  const { data, error, count } = result || {};
  if (error) {
    const err = new Error(error.message || `Failed to ${context}`);
    err.code = error.code;
    throw err;
  }
  return { data, count };
}

/**
 * PUBLIC_INTERFACE
 * paginate - Calculates range indices for Supabase range() and returns meta.
 */
export function paginate({ page = 1, limit = 20 } = {}) {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.max(1, Number(limit) || 20);
  const from = (safePage - 1) * safeLimit;
  const to = from + safeLimit - 1;
  return {
    from,
    to,
    meta: {
      page: safePage,
      limit: safeLimit,
    },
  };
}

/**
 * PUBLIC_INTERFACE
 * withCount - Ensures select includes count metadata where applicable.
 * Usage: withCount(supabase.from('table').select('*, ...', { count: 'exact' }))
 */
export function withCount(query) {
  // If developer hasn't specified select yet, we apply a default select with count
  // Supabase JS supports calling select multiple times; the last wins.
  try {
    return query.select('*', { count: 'exact' });
  } catch {
    return query;
  }
}

/**
 * PUBLIC_INTERFACE
 * getProfileById - Helper to fetch a profile by user id
 */
export async function getProfileById(userId) {
  const { data, error } = await supabase.from(tableNames.profiles).select('*').eq('id', userId).single();
  if (error) throw error;
  return data;
}
