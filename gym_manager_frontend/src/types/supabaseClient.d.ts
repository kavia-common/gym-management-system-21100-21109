import type { SupabaseClient } from '@supabase/supabase-js';

// PUBLIC_INTERFACE
export const supabase: SupabaseClient;

// PUBLIC_INTERFACE
export function getSupabaseEnv(): { url: string; key: string };
export default supabase;
