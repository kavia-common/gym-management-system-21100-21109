import { supabase } from '../../lib/supabaseClient';
import { assertSupabaseReady, handle, paginate, tableNames, withCount } from './helpers';

/**
 * PUBLIC_INTERFACE
 * list - List payments with filters: memberId, amount range, date range.
 */
export async function list({ page = 1, limit = 20, memberId, from, to, minAmount, maxAmount } = {}) {
  assertSupabaseReady();
  const { from: rFrom, to: rTo, meta } = paginate({ page, limit });

  let query = withCount(supabase.from(tableNames.payments));
  if (memberId) query = query.eq('memberId', memberId);
  if (from) query = query.gte('date', from);
  if (to) query = query.lte('date', to);
  if (typeof minAmount !== 'undefined') query = query.gte('amount', Number(minAmount));
  if (typeof maxAmount !== 'undefined') query = query.lte('amount', Number(maxAmount));

  const result = await query.order('date', { ascending: false }).range(rFrom, rTo);
  const { data, count } = handle(result, 'list payments');
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
 * getById - Get payment by id.
 */
export async function getById(id) {
  assertSupabaseReady();
  const result = await supabase.from(tableNames.payments).select('*').eq('id', id).single();
  const { data } = handle(result, 'get payment');
  return data;
}

/**
 * PUBLIC_INTERFACE
 * create - Record a payment.
 */
export async function create(payload) {
  assertSupabaseReady();
  const result = await supabase.from(tableNames.payments).insert(payload).select().single();
  const { data } = handle(result, 'create payment');
  return data;
}

/**
 * PUBLIC_INTERFACE
 * update - Update payment by id (e.g., refund status).
 */
export async function update(id, patch) {
  assertSupabaseReady();
  const result = await supabase.from(tableNames.payments).update(patch).eq('id', id).select().single();
  const { data } = handle(result, 'update payment');
  return data;
}

/**
 * PUBLIC_INTERFACE
 * remove - Delete payment by id.
 */
export async function remove(id) {
  assertSupabaseReady();
  const result = await supabase.from(tableNames.payments).delete().eq('id', id);
  handle(result, 'delete payment');
  return true;
}
