import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { authFailure, authSuccess, startAuth } from '../../state/slices/authSlice';

/**
 * Register page integrated with Redux auth.
 * It simulates a registration flow, sets auth state, and redirects by chosen role.
 */
export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector((s) => s.auth.status);
  const error = useSelector((s) => s.auth.error);

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState('member');

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(startAuth());

    setTimeout(() => {
      if (!name || !email || !password) {
        dispatch(authFailure('All fields are required.'));
        return;
      }

      const fakeToken = 'mock-jwt-token';
      const user = { id: 'u_2', name, role };

      dispatch(authSuccess({ user, token: fakeToken }));

      if (role === 'owner') navigate('/owner', { replace: true });
      else if (role === 'trainer') navigate('/trainer', { replace: true });
      else navigate('/member', { replace: true });
    }, 600);
  };

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Register</h2>
      <p style={{ color: 'var(--color-text-muted)' }}>Create your Gym Manager account.</p>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, marginTop: 12 }}>
        <Input label="Full Name" placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Password" type="password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <div style={{ display: 'grid', gap: 6 }}>
          <label htmlFor="role" style={{ fontWeight: 600, fontSize: 14 }}>Register as</label>
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
            {status === 'loading' ? 'Creating...' : 'Sign Up'}
          </Button>
          <Link to="/login" className="btn btn-ghost" style={{ alignSelf: 'center' }}>Already have an account?</Link>
        </div>
      </form>
    </div>
  );
}
