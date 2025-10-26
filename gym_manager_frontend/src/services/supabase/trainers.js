import { supabase } from '../../lib/supabaseClient';
import { assertSupabaseReady, handle, paginate, tableNames, withCount } from './helpers';

/**
 * PUBLIC_INTERFACE
 * list - List trainers with optional q and specialty filter.
 */
export async function list({ page = 1, limit = 20, q = '', specialty } = {}) {
  assertSupabaseReady();
  const { from, to, meta } = paginate({ page, limit });

  let query = withCount(supabase.from(tableNames.trainers));
  if (specialty) query = query.ilike('specialty', `%${specialty}%`);
  if (q) {
    const like = `%${q}%`;
    query = query.or(`name.ilike.${like},email.ilike.${like}`);
  }

  const result = await query.order('createdAt', { ascending: false }).range(from, to);
  const { data, count } = handle(result, 'list trainers');
  return {
    data: data || [],
    pagination: {
      ...meta,
      total: count ?? (data?.length || 0),
      hasNext: count ? to + 1 < count : false,
    },
  };
}

/**
 * PUBLIC_INTERFACE
 * getById - Get trainer by id.
 */
export async function getById(id) {
  assertSupabaseReady();
  const result = await supabase.from(tableNames.trainers).select('*').eq('id', id).single();
  const { data } = handle(result, 'get trainer');
  return data;
}

/**
 * PUBLIC_INTERFACE
 * create - Create a trainer.
 */
export async function create(payload) {
  assertSupabaseReady();
  const result = await supabase.from(tableNames.trainers).insert(payload).select().single();
  const { data } = handle(result, 'create trainer');
  return data;
}

/**
 * PUBLIC_INTERFACE
 * update - Update trainer by id.
 */
export async function update(id, patch) {
  assertSupabaseReady();
  const result = await supabase.from(tableNames.trainers).update(patch).eq('id', id).select().single();
  const { data } = handle(result, 'update trainer');
  return data;
}

/**
 * PUBLIC_INTERFACE
 * remove - Delete trainer by id.
 */
export async function remove(id) {
  assertSupabaseReady();
  const result = await supabase.from(tableNames.trainers).delete().eq('id', id);
  handle(result, 'delete trainer');
  return true;
}
