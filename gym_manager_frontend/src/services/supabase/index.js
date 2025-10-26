export { default as supabase } from '../../lib/supabaseClient';
export { supabase as supabaseClient, getCurrentSession } from '../../lib/supabaseClient';

// Aggregate service exports for convenient namespaced imports in UI pages
import * as bookingsService from './bookings';
import * as classesService from './classes';
import * as membersService from './members';
import * as paymentsService from './payments';
import * as profilesService from './profiles';
import * as programsService from './programs';
import * as trainersService from './trainers';

export {
  bookingsService,
  classesService,
  membersService,
  paymentsService,
  profilesService,
  programsService,
  trainersService,
};
