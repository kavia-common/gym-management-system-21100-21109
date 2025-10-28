 /**
  * Supabase Services - Centralized named exports only.
  * Do not wrap or re-export the client as a nested object. Consumers must use:
  *   import { supabase, getCurrentSession } from '../../lib/supabaseClient';
  * and service modules as named groups below.
  */
import supabase from '../../lib/supabaseClient';
import * as bookingsService from './bookings';
import * as classesService from './classes';
import * as membersService from './members';
import * as paymentsService from './payments';
import * as profilesService from './profiles';
import * as programsService from './programs';
import * as trainersService from './trainers';

// Re-export only named symbols. No default export allowed.
export {
  supabase,
  bookingsService,
  classesService,
  membersService,
  paymentsService,
  profilesService,
  programsService,
  trainersService,
};
