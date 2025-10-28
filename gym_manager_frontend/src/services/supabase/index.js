import supabase from '../../lib/supabaseClient';
import * as bookingsModule from './bookings';
import * as classesModule from './classes';
import * as membersModule from './members';
import * as paymentsModule from './payments';
import * as profilesModule from './profiles';
import * as programsModule from './programs';
import * as trainersModule from './trainers';

// Re-export the shared supabase client for convenience
// PUBLIC_INTERFACE
export { supabase as client };

/**
 * Re-export helper functions if present.
 * This ensures existing imports like `import { fromTable } from 'services/supabase'` won't break
 * if they are defined in helpers.js.
 */
export * from './helpers';

// Optionally export domain service modules (bookings, classes, etc.) if consumers rely on them.
// These exports are safe as they only re-export symbols if/when imported by consumers.
export * as bookings from './bookings';
export * as classes from './classes';
export * as members from './members';
export * as payments from './payments';
export * as profiles from './profiles';
export * as programs from './programs';
export * as trainers from './trainers';

/**
 * Not all modules export a default. Build "Service" aliases as objects
 * composed of their named functions to satisfy imports like `bookingsService`.
 */
// PUBLIC_INTERFACE
export const bookingsService = { ...bookingsModule };
// PUBLIC_INTERFACE
export const classesService = { ...classesModule };
// PUBLIC_INTERFACE
export const membersService = { ...membersModule };
// PUBLIC_INTERFACE
export const paymentsService = { ...paymentsModule };
// PUBLIC_INTERFACE
export const profilesService = { ...profilesModule };
// PUBLIC_INTERFACE
export const programsService = { ...programsModule };
// PUBLIC_INTERFACE
export const trainersService = { ...trainersModule };
