import supabase from '../../lib/supabaseClient';
import { assertSupabaseReady, handle, paginate, tableNames, withCount } from './helpers';

/**
 * PUBLIC_INTERFACE
 * list - List bookings with filters: memberId, classId, status, date range.
 */
export async function list({ page = 1, limit = 20, memberId, classId, status, from, to } = {}) {
  assertSupabaseReady();
  const { from: rFrom, to: rTo, meta } = paginate({ page, limit });

  let query = withCount(supabase.from(tableNames.bookings));
  if (memberId) query = query.eq('memberId', memberId);
  if (classId) query = query.eq('classId', classId);
  if (status) query = query.eq('status', status);
  if (from) query = query.gte('createdAt', from);
  if (to) query = query.lte('createdAt', to);

  const result = await query.order('createdAt', { ascending: false }).range(rFrom, rTo);
  const { data, count } = handle(result, 'list bookings');
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
 * getById - Fetch booking by id.
 */
export async function getById(id) {
  assertSupabaseReady();
  const result = await supabase.from(tableNames.bookings).select('*').eq('id', id).single();
  const { data } = handle(result, 'get booking');
  return data;
}

/**
 * PUBLIC_INTERFACE
 * create - Create booking.
 */
export async function create(payload) {
  assertSupabaseReady();
  const result = await supabase.from(tableNames.bookings).insert(payload).select().single();
  const { data } = handle(result, 'create booking');
  return data;
}

/**
 * PUBLIC_INTERFACE
 * update - Patch booking by id (e.g., cancel).
 */
export async function update(id, patch) {
  assertSupabaseReady();
  const result = await supabase.from(tableNames.bookings).update(patch).eq('id', id).select().single();
  const { data } = handle(result, 'update booking');
  return data;
}

/**
 * PUBLIC_INTERFACE
 * remove - Delete booking by id.
 */
export async function remove(id) {
  assertSupabaseReady();
  const result = await supabase.from(tableNames.bookings).delete().eq('id', id);
  handle(result, 'delete booking');
  return true;
}

/**
 * PUBLIC_INTERFACE
 * enrollInClass - Domain helper to book a class for a member with basic capacity check.
 * Note: For accurate capacity handling, implement a DB constraint or RPC in Supabase.
 */
export async function enrollInClass({ memberId, classId }) {
  assertSupabaseReady();
  if (!memberId || !classId) throw new Error('memberId and classId are required');

  // Fetch class to read capacity
  const clsRes = await supabase.from(tableNames.classes).select('id,capacity').eq('id', classId).single();
  const cls = handle(clsRes, 'get class for booking').data;
  if (!cls) throw new Error('Class not found');

  // Count confirmed bookings
  const countRes = await withCount(
    supabase.from(tableNames.bookings).select('id', { count: 'exact' }).eq('classId', classId).eq('status', 'confirmed')
  );
  const { count } = handle(countRes, 'count class bookings');

  if (typeof cls.capacity === 'number' && count >= cls.capacity) {
    const err = new Error('Capacity reached');
    err.code = 'CONFLICT';
    throw err;
  }

  // Create booking with status confirmed
  return await create({ memberId, classId, status: 'confirmed' });
}
