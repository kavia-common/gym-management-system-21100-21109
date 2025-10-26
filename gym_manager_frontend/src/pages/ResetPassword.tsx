import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import supabase from '../lib/supabaseClient';

const styles = {
  container: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    backgroundColor: '#f9fafb',
    padding: '24px',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    background: '#ffffff',
    borderRadius: 12,
    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
    padding: 24,
  },
  title: { margin: 0, marginBottom: 8, color: '#111827' },
  subtitle: { margin: 0, marginBottom: 16, color: '#6b7280', fontSize: 14 },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    outline: 'none',
    marginBottom: 12,
  },
  button: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 10,
    border: 'none',
    backgroundColor: '#2563EB',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
  },
  alert: (type: 'error' | 'success' | 'info') => ({
    padding: '10px 12px',
    borderRadius: 8,
    marginBottom: 12,
    color:
      type === 'error' ? '#991b1b' : type === 'success' ? '#065f46' : '#1e40af',
    background:
      type === 'error' ? '#fee2e2' : type === 'success' ? '#d1fae5' : '#dbeafe',
    border: `1px solid ${
      type === 'error' ? '#fecaca' : type === 'success' ? '#a7f3d0' : '#bfdbfe'
    }`,
  }),
};

export default function ResetPassword() {
  const { updatePassword } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState<{ type: 'error' | 'success' | 'info'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);

  // When routed via the recovery link, Supabase sets a session automatically.
  useEffect(() => {
    let mounted = true;
    async function ensureSessionFromUrl() {
      try {
        // This call ensures the URL hash is parsed (if needed) and session is established.
        await supabase.auth.getSession();
        if (mounted) setReady(true);
      } catch {
        if (mounted) setReady(true);
      }
    }
    ensureSessionFromUrl();
    return () => {
      mounted = false;
    };
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (!newPassword) {
      setMsg({ type: 'error', text: 'Please enter a new password.' });
      return;
    }

    setSubmitting(true);
    const { error } = await updatePassword(newPassword);
    setSubmitting(false);

    if (error) {
      setMsg({ type: 'error', text: error });
    } else {
      setMsg({ type: 'success', text: 'Password updated. You can now log in with the new password.' });
    }
  };

  return (
    <div style={styles.container as React.CSSProperties}>
      <div style={styles.card as React.CSSProperties}>
        <h2 style={styles.title as React.CSSProperties}>Set a new password</h2>
        {!ready && <div style={styles.alert('info')}>Preparing reset flow...</div>}
        {msg && <div style={styles.alert(msg.type)}>{msg.text}</div>}
        <form onSubmit={onSubmit}>
          <input
            style={styles.input as React.CSSProperties}
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            aria-label="New password"
            minLength={6}
            required
            disabled={!ready}
          />
          <button
            style={styles.button as React.CSSProperties}
            disabled={submitting || !ready}
            type="submit"
          >
            {submitting ? 'Updating...' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  );
}
