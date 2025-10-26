import supabase from '../../lib/supabaseClient';
import { assertSupabaseReady, handle, paginate, tableNames, withCount } from './helpers';

/**
 * PUBLIC_INTERFACE
 * list - List classes with filters: q, trainerId, date range, sort.
 */
export async function list({ page = 1, limit = 20, q = '', trainerId, from, to, sort } = {}) {
  assertSupabaseReady();
  const { from: rFrom, to: rTo, meta } = paginate({ page, limit });

  let query = withCount(supabase.from(tableNames.classes));

  if (q) {
    const like = `%${q}%`;
    query = query.or(`title.ilike.${like},trainer.ilike.${like}`);
  }
  if (trainerId) query = query.eq('trainerId', trainerId);
  if (from) query = query.gte('scheduledAt', from);
  if (to) query = query.lte('scheduledAt', to);

  // Sorting - default newest first
  if (sort === 'title_asc') query = query.order('title', { ascending: true });
  else if (sort === 'title_desc') query = query.order('title', { ascending: false });
  else query = query.order('createdAt', { ascending: false });

  const result = await query.range(rFrom, rTo);
  const { data, count } = handle(result, 'list classes');
  return {
    data: data || [],
    pagination: {
      ...meta,
      total: count ?? (data?.length || 0),
      hasNext: count ? rTo + 1 < count : false,
    },
  };
}

/**
 * PUBLIC_INTERFACE
 * getById - Get a class by id.
 */
export async function getById(id) {
  assertSupabaseReady();
  const result = await supabase.from(tableNames.classes).select('*').eq('id', id).single();
  const { data } = handle(result, 'get class');
  return data;
}

/**
 * PUBLIC_INTERFACE
 * create - Create a class.
 */
export async function create(payload) {
  assertSupabaseReady();
  const result = await supabase.from(tableNames.classes).insert(payload).select().single();
  const { data } = handle(result, 'create class');
  return data;
}

/**
 * PUBLIC_INTERFACE
 * update - Update a class by id.
 */
export async function update(id, patch) {
  assertSupabaseReady();
  const result = await supabase.from(tableNames.classes).update(patch).eq('id', id).select().single();
  const { data } = handle(result, 'update class');
  return data;
}

/**
 * PUBLIC_INTERFACE
 * remove - Delete a class by id.
 */
export async function remove(id) {
  assertSupabaseReady();
  const result = await supabase.from(tableNames.classes).delete().eq('id', id);
  handle(result, 'delete class');
  return true;
}

/**
 * PUBLIC_INTERFACE
 * listByTrainer - Convenience to list classes for a trainer.
 */
export async function listByTrainer(trainerId, { page = 1, limit = 20 } = {}) {
  return list({ page, limit, trainerId });
}

/**
 * PUBLIC_INTERFACE
 * listUpcoming - List classes scheduled in the future.
 */
export async function listUpcoming({ page = 1, limit = 20 } = {}) {
  const now = new Date().toISOString();
  return list({ page, limit, from: now, sort: 'title_asc' });
}
