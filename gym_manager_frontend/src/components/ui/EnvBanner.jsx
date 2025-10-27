import React from 'react';
import { __supabaseEnvPresence, __supabaseEnvSource } from '../../lib/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * EnvBanner
 * Diagnostic banner to verify Supabase env injection at runtime.
 * Safely reads debug helpers and only renders when envs are missing.
 * It never throws at runtime if helpers or envs are undefined.
 */
function EnvBanner() {
  // Guard against process being undefined in browser or when not injected
  const nodeEnv =
    typeof process !== 'undefined' && process && process.env ? process.env : {};
  const isProd = nodeEnv.NODE_ENV === 'production';

  // The debug helpers are optional; use safe destructuring and defaults.
  // Current helpers shape (per supabaseClient.js/ts):
  // __supabaseEnvPresence: { hasUrl: boolean, hasKey: boolean }
  // __supabaseEnvSource: { urlSource: string|null, keySource: string|null }
  const presence = (__supabaseEnvPresence && {
    hasUrl: Boolean(__supabaseEnvPresence?.hasUrl),
    hasKey: Boolean(__supabaseEnvPresence?.hasKey),
  }) || { hasUrl: false, hasKey: false };

  const source = (__supabaseEnvSource && {
    urlSource: __supabaseEnvSource?.urlSource ?? null,
    keySource: __supabaseEnvSource?.keySource ?? null,
  }) || { urlSource: null, keySource: null };

  // Show banner only when some required env is missing.
  const missing = !presence.hasUrl || !presence.hasKey;

  if (!missing) {
    // All envs present; keep UI clean
    return null;
  }

  const parts = [
    `URL:${presence.hasUrl ? 'OK' : 'MISSING'}${source.urlSource ? `@${source.urlSource}` : ''}`,
    `KEY:${presence.hasKey ? 'OK' : 'MISSING'}${source.keySource ? `@${source.keySource}` : ''}`,
  ];

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        padding: '6px 12px',
        background: '#FEF3C7',
        color: '#92400E',
        fontSize: 12,
        borderBottom: '1px solid #F59E0B',
      }}
    >
      <strong>Environment:</strong> {isProd ? 'Production' : 'Development'} |{' '}
      <strong>Supabase env:</strong> {parts.join(' | ')}. Configure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY.
    </div>
  );
}

export default EnvBanner;
