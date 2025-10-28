import React from 'react';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

/**
 * PUBLIC_INTERFACE
 * A small banner that renders when Supabase env vars are missing.
 * Helps guide developers in local setup and prevents silent runtime failures.
 */
export default function EnvBanner() {
  const missing = !supabaseUrl || !supabaseKey;
  if (!missing) return null;

  return (
    <div style={{
      background: '#FEF3C7',
      color: '#92400E',
      padding: '8px 12px',
      fontSize: 14,
      borderBottom: '1px solid rgba(146,64,14,0.2)'
    }}>
      Missing Supabase configuration. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY
      (or VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) in your .env file.
    </div>
  );
}
