import supabase from '../../lib/supabaseClient';
import { assertSupabaseReady, handle, paginate, tableNames, withCount } from './helpers';

/**
 * PUBLIC_INTERFACE
 * list - List programs with filters: trainerId, q.
 */
export async function list({ page = 1, limit = 20, trainerId, q = '' } = {}) {
  assertSupabaseReady();
  const { from, to, meta } = paginate({ page, limit });

  let query = withCount(supabase.from(tableNames.programs));
  if (trainerId) query = query.eq('trainerId', trainerId);
  if (q) query = query.ilike('title', `%${q}%`);

  const result = await query.order('createdAt', { ascending: false }).range(from, to);
  const { data, count } = handle(result, 'list programs');
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
 * getById - Get program by id.
 */
export async function getById(id) {
  assertSupabaseReady();
  const result = await supabase.from(tableNames.programs).select('*').eq('id', id).single();
  const { data } = handle(result, 'get program');
  return data;
}

/**
 * PUBLIC_INTERFACE
 * create - Create a program.
 */
export async function create(payload) {
  assertSupabaseReady();
  const result = await supabase.from(tableNames.programs).insert(payload).select().single();
  const { data } = handle(result, 'create program');
  return data;
}

/**
 * PUBLIC_INTERFACE
 * update - Update program by id.
 */
export async function update(id, patch) {
  assertSupabaseReady();
  const result = await supabase.from(tableNames.programs).update(patch).eq('id', id).select().single();
  const { data } = handle(result, 'update program');
  return data;
}

/**
 * PUBLIC_INTERFACE
 * remove - Delete program by id.
 */
export async function remove(id) {
  assertSupabaseReady();
  const result = await supabase.from(tableNames.programs).delete().eq('id', id);
  handle(result, 'delete program');
  return true;
}
