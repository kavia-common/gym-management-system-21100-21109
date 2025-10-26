import React from 'react';
import { __supabaseEnvPresence, __supabaseEnvSource } from '../../lib/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * EnvBanner
 * Diagnostic banner to verify Supabase env injection at runtime.
 * Shows non-sensitive presence booleans and the chosen source.
 * Remove after confirming env detection.
 */
function EnvBanner() {
  const isProd = process.env.NODE_ENV === 'production';

  const presence = __supabaseEnvPresence || {
    CRA: { URL: false, ANON_KEY: false },
    VITE: { URL: false, ANON_KEY: false },
    NODE: { URL: false, ANON_KEY: false },
  };
  const chosen = __supabaseEnvSource || 'NONE';

  const parts = [
    `SRC:${chosen}`,
    `CRA(U:${presence.CRA.URL ? '1' : '0'} K:${presence.CRA.ANON_KEY ? '1' : '0'})`,
    `VITE(U:${presence.VITE.URL ? '1' : '0'} K:${presence.VITE.ANON_KEY ? '1' : '0'})`,
    `NODE(U:${presence.NODE.URL ? '1' : '0'} K:${presence.NODE.ANON_KEY ? '1' : '0'})`,
  ];

  return (
    <div style={{ padding: '6px 12px', background: '#FEF3C7', color: '#92400E', fontSize: 12, borderBottom: '1px solid #F59E0B' }}>
      <strong>Environment:</strong> {isProd ? 'Production' : 'Development'} | <strong>Supabase:</strong> {parts.join(' | ')}
    </div>
  );
}

export default EnvBanner;
