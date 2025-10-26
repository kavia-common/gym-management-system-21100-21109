import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

// One-time logger guard to avoid duplicate logs on HMR or multiple imports
let hasLoggedSource = false;

/**
 * Resolve Supabase configuration from supported env sources in priority order:
 * 1) CRA: REACT_APP_SUPABASE_URL / REACT_APP_SUPABASE_ANON_KEY
 * 2) Vite: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
 * 3) Unprefixed: SUPABASE_URL / SUPABASE_ANON_KEY
 * Logs a single info with which source was used (without values). Keeps no-op client fallback if not found.
 */
function resolveSupabaseEnv():
  | { url: string; key: string; source: 'REACT_APP' | 'VITE' | 'UNPREFIXED' }
  | null {
  // CRA
  const craUrl = typeof process !== 'undefined' ? process.env?.REACT_APP_SUPABASE_URL : undefined;
  const craKey = typeof process !== 'undefined' ? process.env?.REACT_APP_SUPABASE_ANON_KEY : undefined;
  if (craUrl && craKey) {
    return { url: craUrl, key: craKey, source: 'REACT_APP' };
  }

  // Vite
  const viteUrl = (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_SUPABASE_URL) as string | undefined;
  const viteKey = (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY) as string | undefined;
  if (viteUrl && viteKey) {
    return { url: viteUrl, key: viteKey, source: 'VITE' };
  }

  // Unprefixed
  const rawUrl = typeof process !== 'undefined' ? process.env?.SUPABASE_URL : undefined;
  const rawKey = typeof process !== 'undefined' ? process.env?.SUPABASE_ANON_KEY : undefined;
  if (rawUrl && rawKey) {
    return { url: rawUrl, key: rawKey, source: 'UNPREFIXED' };
  }

  return null;
}

const resolved = resolveSupabaseEnv();

if (resolved) {
  supabase = createClient(resolved.url, resolved.key);
  if (!hasLoggedSource) {
    hasLoggedSource = true;
    // Log only the source prefix used, never the actual values
    console.info(`[Supabase] Initialized using ${resolved.source} env variables.`);
  }
} else {
  // Fallback to a no-op client if env vars are not provided
  // This prevents runtime crashes during docs/tests or storybook.
  // Functions that rely on supabase should guard for null.
  if ((process as any)?.env?.NODE_ENV !== 'test' && !hasLoggedSource) {
    hasLoggedSource = true;
    console.warn(
      '[Supabase] No environment variables found for Supabase. Using no-op client. Expected one of: REACT_APP_*, VITE_*, or unprefixed SUPABASE_*.'
    );
  }
}

/**
 * Returns the initialized Supabase client or null when configuration is missing.
 * Callers should guard for null in environments where Supabase is not configured (e.g., Storybook, docs).
 */
// PUBLIC_INTERFACE
export function getSupabaseClient(): SupabaseClient | null {
  /** Returns the initialized Supabase client or null when configuration is missing. */
  return supabase;
}

export default supabase;
