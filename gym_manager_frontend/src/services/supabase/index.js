/**
 * Supabase Services - Centralized exports.
 * Ensures all imports are at the top to satisfy ESLint import/first rule,
 * and re-exports service modules in a clean, consolidated manner.
 * The supabase client exported here is always defined (real or safe no-op).
 */
// imports (top only) - all imports must be at the top per ESLint import/first
import { supabase, getCurrentSession } from '../../lib/supabaseClient';
import * as bookingsService from './bookings';
import * as classesService from './classes';
import * as membersService from './members';
import * as paymentsService from './payments';
import * as profilesService from './profiles';
import * as programsService from './programs';
import * as trainersService from './trainers';

// Local constants derived from imports
const supabaseClient = supabase;

// re-exports (named)
export {
  supabase,
  supabaseClient,
  getCurrentSession,
  bookingsService,
  classesService,
  membersService,
  paymentsService,
  profilesService,
  programsService,
  trainersService,
};

// default aggregate export (optional convenience)
export default {
  supabase,
  supabaseClient,
  getCurrentSession,
  bookingsService,
  classesService,
  membersService,
  paymentsService,
  profilesService,
  programsService,
  trainersService,
};
