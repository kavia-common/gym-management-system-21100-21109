import supabase from '../../lib/supabaseClient';
import { assertSupabaseReady, handle, paginate, tableNames, withCount } from './helpers';

/**
 * PUBLIC_INTERFACE
 * list - List members with optional text search and status filter.
 */
export async function list({ page = 1, limit = 20, q = '', status } = {}) {
  assertSupabaseReady();
  const { from, to, meta } = paginate({ page, limit });

  let query = withCount(supabase.from(tableNames.members));
  // Basic filtering: status and q (search name/email)
  if (status) query = query.eq('status', status);
  if (q) {
    const like = `%${q}%`;
    query = query.or(`name.ilike.${like},email.ilike.${like}`);
  }

  const result = await query
    .order('createdAt', { ascending: false })
    .range(from, to);

  const { data, count } = handle(result, 'list members');
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
 * getById - Fetch single member by id.
 */
export async function getById(id) {
  assertSupabaseReady();
  const result = await supabase.from(tableNames.members).select('*').eq('id', id).single();
  const { data } = handle(result, 'get member');
  return data;
}

/**
 * PUBLIC_INTERFACE
 * create - Create a new member.
 */
export async function create(payload) {
  assertSupabaseReady();
  const result = await supabase.from(tableNames.members).insert(payload).select().single();
  const { data } = handle(result, 'create member');
  return data;
}

/**
 * PUBLIC_INTERFACE
 * update - Patch a member by id.
 */
export async function update(id, patch) {
  assertSupabaseReady();
  const result = await supabase.from(tableNames.members).update(patch).eq('id', id).select().single();
  const { data } = handle(result, 'update member');
  return data;
}

/**
 * PUBLIC_INTERFACE
 * remove - Delete a member by id.
 */
export async function remove(id) {
  assertSupabaseReady();
  const result = await supabase.from(tableNames.members).delete().eq('id', id);
  handle(result, 'delete member');
  return true;
}
