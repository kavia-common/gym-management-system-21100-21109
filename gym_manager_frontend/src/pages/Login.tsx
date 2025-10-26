import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
    backgroundColor: '#2563EB',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
  },
  linkRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 12,
    fontSize: 14,
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

export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation() as any;
  const from = location.state?.from?.pathname || '/dashboard';

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (!email || !password) {
      setMsg({ type: 'error', text: 'Please enter email and password.' });
      return;
    }

    setSubmitting(true);
    const { error } = await signIn({ email, password });
    setSubmitting(false);

    if (error) {
      setMsg({ type: 'error', text: error });
    } else {
      setMsg({ type: 'success', text: 'Logged in successfully. Redirecting...' });
      setTimeout(() => navigate(from, { replace: true }), 600);
    }
  };

  return (
    <div style={styles.container as React.CSSProperties}>
      <div style={styles.card as React.CSSProperties}>
        <h2 style={styles.title as React.CSSProperties}>Welcome back</h2>
        <p style={styles.subtitle as React.CSSProperties}>Log in to access your dashboard</p>
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
          <input
            style={styles.input as React.CSSProperties}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-label="Password"
            required
          />
          <button style={styles.button as React.CSSProperties} disabled={submitting} type="submit">
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div style={styles.linkRow as React.CSSProperties}>
          <Link to="/signup" style={{ color: '#2563EB' }}>
            Create account
          </Link>
          <Link to="/forgot-password" style={{ color: '#F59E0B' }}>
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
}
