import type { SupabaseClient } from '@supabase/supabase-js';

declare module '*.svg' {
  const content: string;
  export default content;
}

/**
 * Ambient declaration so JS files importing the TS client get proper types in editors.
 * Only named exports are supported to avoid runtime mismatches.
 */
declare module '../lib/supabaseClient' {
  export const supabase: SupabaseClient;
  export function getSupabaseClient(): SupabaseClient;
}
