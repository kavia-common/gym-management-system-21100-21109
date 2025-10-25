import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { authFailure, authSuccess, startAuth } from '../../state/slices/authSlice';
import { getSupabaseClient } from '../../lib/supabaseClient';

/**
 * Login page integrated with Redux auth.
 * It simulates an auth call and stores token/user/role, then redirects based on role.
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

    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        dispatch(authFailure(error.message || 'Invalid credentials.'));
        return;
      }

      const session = data?.session;
      const profile = data?.user || session?.user;

      const token = session?.access_token || null;
      if (!profile || !token) {
        dispatch(authFailure('No session returned.'));
        return;
      }

      const role =
        profile?.app_metadata?.role ||
        profile?.user_metadata?.role ||
        'member';

      const user = {
        id: profile.id,
        name: profile.user_metadata?.name || profile.email || 'User',
        email: profile.email || '',
        role,
      };

      dispatch(authSuccess({ user, token }));

      if (from) {
        navigate(from, { replace: true });
        return;
      }
      if (role === 'owner') navigate('/owner', { replace: true });
      else if (role === 'trainer') navigate('/trainer', { replace: true });
      else navigate('/member', { replace: true });
    } catch (err) {
      dispatch(authFailure(err?.message || 'Sign in failed.'));
    }
  };

  const signInWithGoogle = async () => {
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth/callback',
        },
      });
    } catch (err) {
      dispatch(authFailure(err?.message || 'Google sign-in failed.'));
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


        {error ? (
          <div style={{ color: 'var(--color-error)', fontSize: 13 }}>{error}</div>
        ) : null}

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="primary" type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Signing In...' : 'Sign In'}
          </Button>
          <Button variant="secondary" type="button" onClick={signInWithGoogle}>
            Continue with Google
          </Button>
          <Link to="/register" className="btn btn-ghost">Create an account</Link>
        </div>
      </form>
    </div>
  );
}
