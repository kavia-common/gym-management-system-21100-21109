import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { authFailure, authSuccess, startAuth } from '../../state/slices/authSlice';

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
  const [role, setRole] = React.useState('member'); // selector to simulate logging in as a specific role

  const from = location.state?.from?.pathname;

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(startAuth());

    // Simulated async auth (replace with real API call)
    setTimeout(() => {
      if (!email || !password) {
        dispatch(authFailure('Email and password are required.'));
        return;
      }

      // Fake token and user with selected role
      const fakeToken = 'mock-jwt-token';
      const user = { id: 'u_1', name: 'Demo User', role };

      dispatch(authSuccess({ user, token: fakeToken }));

      // If a "from" path exists (user tried to access a protected route), go there
      if (from) {
        navigate(from, { replace: true });
        return;
      }

      // Otherwise, navigate based on role
      if (role === 'owner') navigate('/owner', { replace: true });
      else if (role === 'trainer') navigate('/trainer', { replace: true });
      else navigate('/member', { replace: true });
    }, 500);
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
        {/* Role selector to simulate role-based login */}
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
