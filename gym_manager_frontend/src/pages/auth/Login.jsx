import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { authFailure, authSuccess, startAuth } from '../../state/slices/authSlice';
import { supabase } from '../../lib/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * Login page which uses Supabase email/password authentication exclusively.
 * Shows clear error messages returned by Supabase and handles loading state.
 */
export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const status = useSelector((s) => s.auth.status);
  const error = useSelector((s) => s.auth.error);

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(startAuth());

    if (!email || !password) {
      dispatch(authFailure('Email and password are required.'));
      return;
    }

    try {
      const { data, error: sbError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (sbError) {
        dispatch(authFailure(sbError.message || 'Invalid credentials.'));
        return;
      }

      const session = data?.session || null;
      const profile = data?.user || null;
      const token = session?.access_token || null;

      const resolvedRole =
        profile?.app_metadata?.role ||
        profile?.user_metadata?.role ||
        'member';

      const user = {
        id: profile?.id,
        name: profile?.user_metadata?.name || profile?.email || 'User',
        email: profile?.email || email,
        role: resolvedRole,
      };

      dispatch(authSuccess({ user, token }));

      // Navigate to intended route or role dashboard
      if (from) {
        navigate(from, { replace: true });
        return;
      }
      if (resolvedRole === 'owner') navigate('/owner', { replace: true });
      else if (resolvedRole === 'trainer') navigate('/trainer', { replace: true });
      else navigate('/member', { replace: true });
    } catch (err) {
      dispatch(authFailure(err?.message || 'Login failed.'));
    }
  };

  // Defensive UI if envs are missing and client failed to init (module would have thrown).
  // If this component renders, show a note to help users configure env.
  let envWarning = null;
  if (!process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_ANON_KEY) {
    envWarning = (
      <div style={{ background: '#FFF7ED', color: '#9A3412', padding: 10, borderRadius: 6, margin: '8px 0' }}>
        Supabase is not configured. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your environment.
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Login</h2>
      <p style={{ color: 'var(--color-text-muted)' }}>Enter your credentials to access your dashboard.</p>
      {envWarning}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, marginTop: 12 }}>
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error ? (
          <div style={{ color: 'var(--color-error)', fontSize: 13 }}>{error}</div>
        ) : null}

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Button variant="primary" type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Signing In...' : 'Sign In'}
          </Button>
          <Link to="/register" className="btn btn-ghost">Create an account</Link>
        </div>
      </form>
    </div>
  );
}
