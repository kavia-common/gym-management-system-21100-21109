//
// Centralized configuration for the Gym Manager Frontend.
// Reads values from environment variables and exposes them in a typed, documented way.
//

// PUBLIC_INTERFACE
export function getEnvVar(name, fallback = undefined) {
  /** Retrieve an environment variable with optional fallback, ensuring string return or fallback. */
  const v = process.env[name];
  return typeof v === 'undefined' || v === null || v === '' ? fallback : v;
}

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns normalized API base URL without trailing slash, from REACT_APP_API_BASE_URL. */
  const raw = getEnvVar('REACT_APP_API_BASE_URL', '');
  return String(raw).replace(/\/*$/, '');
}

// PUBLIC_INTERFACE
export function getUseMocks() {
  /** Returns boolean flag indicating if mock mode is enabled (REACT_APP_USE_MOCKS === 'true'); defaults to false. */
  return String(getEnvVar('REACT_APP_USE_MOCKS', 'false')) === 'true';
}

// PUBLIC_INTERFACE
export function getFeatureFlags() {
  /** Returns a plain object parsed from REACT_APP_FEATURE_FLAGS (JSON string), or {} on failure. */
  const raw = getEnvVar('REACT_APP_FEATURE_FLAGS', '{}');
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    // Silently fall back to empty flags if malformed
    return {};
  }
}

/** Returns Supabase URL from env (REACT_APP_SUPABASE_URL) */
export function getSupabaseUrl() {
  return getEnvVar('REACT_APP_SUPABASE_URL', '');
}

/** Returns Supabase anon key from env (REACT_APP_SUPABASE_ANON_KEY) */
export function getSupabaseAnonKey() {
  return getEnvVar('REACT_APP_SUPABASE_ANON_KEY', '');
}

// PUBLIC_INTERFACE
export const config = {
  /** This is the primary configuration object used in the app. */
  apiBaseUrl: getApiBaseUrl(),
  useMocks: getUseMocks(),
  featureFlags: getFeatureFlags(),
  supabaseUrl: getSupabaseUrl(),
  supabaseAnonKey: getSupabaseAnonKey(),
};
