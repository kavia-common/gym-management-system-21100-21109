/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Ambient declaration for the Supabase client export.
 * This helps TypeScript-aware tooling in mixed JS/TS codebases.
 */

declare module 'src/lib/supabaseClient' {
  import type { SupabaseClient } from '@supabase/supabase-js';
  // PUBLIC_INTERFACE
  export const supabase: SupabaseClient<any, 'public', any>;
}
