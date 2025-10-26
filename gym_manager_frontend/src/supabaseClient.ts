import { createClient, SupabaseClient } from '@supabase/supabase-js';

type SafeSupabase = SupabaseClient & { __noop?: boolean };

let supabase: SafeSupabase;

// One-time logger guard to avoid duplicate logs on HMR or multiple imports
let hasLoggedSource = false;

/**
 * No-op mock Supabase client that safely exposes an .auth interface.
 * Used when environment variables are missing so the app can still boot.
 */
function createNoopSupabase(): SafeSupabase {
  const noop = async (..._args: any[]) => ({ data: null, error: null } as any);
  const subNoop = { unsubscribe: () => {} };
  // @ts-expect-error - minimal surface for consumers
  const client: SafeSupabase = {
    auth: {
      getSession: noop,
      getUser: noop,
      signInWithPassword: noop,
      signUp: noop,
      signOut: noop,
      resetPasswordForEmail: noop,
      updateUser: noop,
      onAuthStateChange: (_cb: any) => ({ data: { subscription: subNoop } } as any),
    } as any,
    from: (_table: string) =>
      ({
        select: noop,
        insert: noop,
        update: noop,
        delete: noop,
        eq: () => ({ select: noop, update: noop, delete: noop }),
        match: () => ({ select: noop, update: noop, delete: noop }),
        single: noop,
      } as any),
    __noop: true,
  } as any;
  return client;
}

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
  const craUrl = typeof process !== 'undefined' ? (process.env as any)?.REACT_APP_SUPABASE_URL : undefined;
  const craKey = typeof process !== 'undefined' ? (process.env as any)?.REACT_APP_SUPABASE_ANON_KEY : undefined;
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
  const rawUrl = typeof process !== 'undefined' ? (process.env as any)?.SUPABASE_URL : undefined;
  const rawKey = typeof process !== 'undefined' ? (process.env as any)?.SUPABASE_ANON_KEY : undefined;
  if (rawUrl && rawKey) {
    return { url: rawUrl, key: rawKey, source: 'UNPREFIXED' };
  }

  return null;
}

const resolved = resolveSupabaseEnv();

if (resolved) {
  supabase = createClient(resolved.url, resolved.key) as SafeSupabase;
  if (!hasLoggedSource) {
    hasLoggedSource = true;
    // Log only the source prefix used, never the actual values
    console.info(`[Supabase] Initialized using ${resolved.source} env variables.`);
  }
} else {
  // Fallback to a no-op client if env vars are not provided
  // This prevents runtime crashes during docs/tests or storybook.
  if ((process as any)?.env?.NODE_ENV !== 'test' && !hasLoggedSource) {
    hasLoggedSource = true;
    console.warn(
      '[Supabase] No environment variables found for Supabase. Using no-op client. Expected one of: REACT_APP_*, VITE_*, or unprefixed SUPABASE_*.'
    );
  }
  supabase = createNoopSupabase();
}

/**
 * Returns the initialized Supabase client (real or safe no-op).
 * Callers can rely on .auth existing; when unconfigured, methods return benign results.
 */
// PUBLIC_INTERFACE
export function getSupabaseClient(): SafeSupabase {
  /** Returns the initialized Supabase client (real or safe no-op). */
  return supabase;
}

export default supabase;
