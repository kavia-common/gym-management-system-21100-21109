import React from 'react';

/**
 * PUBLIC_INTERFACE
 * EnvBanner
 * This component renders a global banner warning if required Supabase environment variables
 * are missing at runtime. It adheres to the Ocean Professional color palette and masks the anon key,
 * but never renders the literal theme name in the UI.
 *
 * Usage:
 *   <EnvBanner />
 *
 * Behavior:
 * - Checks for REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in process.env at runtime.
 * - If any are missing or empty, a prominent warning banner is displayed.
 * - If present but you wish to show their values for debugging, the anon key is masked.
 */
function EnvBanner() {
  // Read env vars (Create React App exposes REACT_APP_* at build time into process.env)
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

  const isMissingUrl = !supabaseUrl || String(supabaseUrl).trim().length === 0;
  const isMissingKey = !supabaseAnonKey || String(supabaseAnonKey).trim().length === 0;
  const showBanner = isMissingUrl || isMissingKey;

  // Mask anon key for safe display, showing only last 4 chars
  const maskKey = (key) => {
    if (!key) return 'N/A';
    const str = String(key);
    const visible = str.slice(-4);
    return `••••••••••••••••••••••••${visible}`;
  };

  if (!showBanner) return null;

  // Ocean Professional Theme Colors (colors only; do not display theme text)
  const colors = {
    primary: '#2563EB', // blue
    secondary: '#F59E0B', // amber
    error: '#EF4444',
    text: '#111827',
    surface: '#FFFFFF',
    background: '#f9fafb',
  };

  const containerStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    width: '100%',
    background: `linear-gradient(90deg, ${colors.primary}1A, ${colors.background})`,
    borderBottom: `1px solid ${colors.primary}33`,
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  };

  const innerStyle = {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '12px 16px',
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
  };

  const badgeStyle = {
    backgroundColor: colors.error,
    color: '#fff',
    borderRadius: 8,
    padding: '6px 10px',
    fontWeight: 600,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    whiteSpace: 'nowrap',
  };

  const contentStyle = {
    color: colors.text,
    lineHeight: 1.4,
    flex: 1,
    fontSize: 14,
  };

  const codeStyle = {
    background: colors.surface,
    border: `1px solid ${colors.primary}33`,
    borderRadius: 6,
    padding: '2px 6px',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: 12,
    color: colors.primary,
  };

  const hintStyle = {
    marginTop: 4,
    color: '#374151',
    fontSize: 13,
  };

  const detailsStyle = {
    marginTop: 6,
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
  };

  const pillStyle = {
    background: '#ffffff',
    border: `1px dashed ${colors.secondary}`,
    color: '#92400E',
    padding: '6px 10px',
    borderRadius: 8,
    fontSize: 12,
  };

  return (
    <div role="status" aria-live="polite" style={containerStyle}>
      <div style={innerStyle}>
        <span style={badgeStyle}>Environment</span>
        <div style={contentStyle}>
          <strong style={{ color: colors.error }}>Supabase configuration missing.</strong>{' '}
          Please set the required environment variables for this app to function correctly.
          <div style={hintStyle}>
            Add the following to your <span style={codeStyle}>.env</span> file (and restart the dev server):
          </div>
          <div style={detailsStyle}>
            {isMissingUrl ? (
              <span style={pillStyle}>
                Missing <span style={codeStyle}>REACT_APP_SUPABASE_URL</span>
              </span>
            ) : (
              <span style={pillStyle}>
                REACT_APP_SUPABASE_URL: <span style={codeStyle}>{supabaseUrl}</span>
              </span>
            )}
            {isMissingKey ? (
              <span style={pillStyle}>
                Missing <span style={codeStyle}>REACT_APP_SUPABASE_ANON_KEY</span>
              </span>
            ) : (
              <span style={pillStyle}>
                REACT_APP_SUPABASE_ANON_KEY:{' '}
                <span style={codeStyle}>{maskKey(supabaseAnonKey)}</span>
              </span>
            )}
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: '#4B5563' }}>
            Tip: Request these values from your project admin. Never commit secrets to source control.
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnvBanner;
