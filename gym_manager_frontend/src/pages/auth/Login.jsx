import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { authFailure, authSuccess, startAuth } from '../../state/slices/authSlice';
import { config } from '../../config';
import { supabase } from '../../lib/supabaseClient';

/**
 * Login page integrated with Redux auth.
 * Uses Supabase email/password in real mode; falls back to mock role selector if REACT_APP_USE_MOCKS=true.
 */
export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const status = useSelector((s) => s.auth.status);
  const error = useSelector((s) => s.auth.error);

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState('member'); // used only in mock mode

  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(startAuth());

    // Mock mode: keep existing simulated behavior
    if (config.useMocks || !supabase) {
      setTimeout(() => {
        if (!email || !password) {
          dispatch(authFailure('Email and password are required.'));
          return;
        }
        const fakeToken = 'mock-jwt-token';
        const user = { id: 'u_1', name: 'Demo User', role, email };
        dispatch(authSuccess({ user, token: fakeToken }));

        if (from) {
          navigate(from, { replace: true });
          return;
        }
        if (role === 'owner') navigate('/owner', { replace: true });
        else if (role === 'trainer') navigate('/trainer', { replace: true });
        else navigate('/member', { replace: true });
      }, 300);
      return;
    }

    // Real mode with Supabase
    if (!email || !password) {
      dispatch(authFailure('Email and password are required.'));
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        dispatch(authFailure(error.message || 'Invalid credentials.'));
        return;
      }
      const session = data.session;
      const profile = data.user;
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

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Login</h2>
      <p style={{ color: 'var(--color-text-muted)' }}>Enter your credentials to access your dashboard.</p>

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
        {/* Role selector visible only in mock mode */}
        { (config.useMocks || !supabase) && (
          <div style={{ display: 'grid', gap: 6 }}>
            <label htmlFor="role" style={{ fontWeight: 600, fontSize: 14 }}>Login as</label>
            <select
              id="role"
              className="input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="owner">Owner</option>
              <option value="trainer">Trainer</option>
              <option value="member">Member</option>
            </select>
          </div>
        )}

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
