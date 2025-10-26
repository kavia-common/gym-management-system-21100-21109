import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
    backgroundColor: '#F59E0B',
    color: '#111827',
    fontWeight: 700,
    cursor: 'pointer',
  },
  alert: (type: 'error' | 'success') => ({
    padding: '10px 12px',
    borderRadius: 8,
    marginBottom: 12,
    color: type === 'error' ? '#991b1b' : '#065f46',
    background: type === 'error' ? '#fee2e2' : '#d1fae5',
    border: `1px solid ${type === 'error' ? '#fecaca' : '#a7f3d0'}`,
  }),
};

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (!email) {
      setMsg({ type: 'error', text: 'Please enter your email.' });
      return;
    }

    setSubmitting(true);
    const { error } = await resetPassword(email);
    setSubmitting(false);

    if (error) {
      setMsg({ type: 'error', text: error });
    } else {
      setMsg({
        type: 'success',
        text: 'If the email is registered, a reset link has been sent.',
      });
    }
  };

  return (
    <div style={styles.container as React.CSSProperties}>
      <div style={styles.card as React.CSSProperties}>
        <h2 style={styles.title as React.CSSProperties}>Reset your password</h2>
        <p style={styles.subtitle as React.CSSProperties}>
          Enter your email and we’ll send a password reset link.
        </p>
        {msg && <div style={styles.alert(msg.type)}>{msg.text}</div>}
        <form onSubmit={onSubmit}>
          <input
            style={styles.input as React.CSSProperties}
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email"
            required
          />
          <button style={styles.button as React.CSSProperties} disabled={submitting} type="submit">
            {submitting ? 'Sending...' : 'Send reset link'}
          </button>
        </form>
        <div style={{ marginTop: 12, fontSize: 14 }}>
          <Link to="/login" style={{ color: '#2563EB' }}>
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
