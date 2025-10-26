import type { SupabaseClient } from '@supabase/supabase-js';

declare module '*.svg' {
  const content: string;
  export default content;
}

/**
 * Ambient declaration so JS files importing the TS client get proper types in editors.
 */
declare module '../lib/supabaseClient' {
  export const supabase: SupabaseClient;
  const defaultExport: SupabaseClient;
  export default defaultExport;
  export function getSupabaseClient(): SupabaseClient;
}
