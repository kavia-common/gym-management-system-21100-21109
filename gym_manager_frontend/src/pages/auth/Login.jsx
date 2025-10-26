import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { authFailure, authSuccess, startAuth } from '../../state/slices/authSlice';

/**
 * Login (stubbed - no backend)
 * - On submit, seeds a local stub auth state and navigates.
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
      // Choose role heuristically from email for demo
      const role = email.includes('owner')
        ? 'owner'
        : email.includes('trainer')
        ? 'trainer'
        : 'member';

      const user = {
        id: 'stub-user',
        name: email?.split('@')[0] || 'Local User',
        email,
        role,
      };

      // Persist stub for future visits
      localStorage.setItem('auth_stub', JSON.stringify(user));

      dispatch(authSuccess({ user, token: 'local-stub-token' }));

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

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Login</h2>
      <p style={{ color: 'var(--color-text-muted)' }}>
        Stubbed - no backend. Use an email containing "owner" or "trainer" to preview role routing.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, marginTop: 12 }}>
        <Input
          label="Email"
          type="email"
          placeholder="owner@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          placeholder="any value"
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
          <Link to="/register" className="btn btn-ghost">Create an account</Link>
        </div>
      </form>
    </div>
  );
}
