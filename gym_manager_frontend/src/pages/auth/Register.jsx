import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { authFailure, authSuccess, startAuth } from '../../state/slices/authSlice';
import { setCurrentSession, setRoleForEmail } from '../../lib/authStub';

/**
 * Register (stubbed - no backend)
 * - Stores a local stub auth state and navigates by selected role.
 * - Only shows Trainer/Member options (Owner must not be selectable).
 */
export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector((s) => s.auth.status);
  const error = useSelector((s) => s.auth.error);

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState('member'); // default to member

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(startAuth());

    try {
      if (!name || !email || !password) {
        dispatch(authFailure('All fields are required.'));
        return;
      }

      // Persist role by email and set current session
      setRoleForEmail(email, role);
      setCurrentSession({ email, role, name });

      const user = { id: 'stub-user', name, email, role };
      dispatch(authSuccess({ user, token: 'local-stub-token' }));

      if (role === 'trainer') navigate('/trainer', { replace: true });
      else navigate('/member', { replace: true }); // default path
    } catch (err) {
      dispatch(authFailure(err?.message || 'Failed to register.'));
    }
  };

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Register</h2>
      <p style={{ color: 'var(--color-text-muted)' }}>
        Stubbed - no backend. Creates a local demo session.
      </p>

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
            {/* Owner is intentionally not shown */}
            <option value="trainer">Trainer</option>
            <option value="member">Member</option>
          </select>
        </div>

        {error ? (
          <div style={{ color: 'var(--color-error)', fontSize: 13 }}>{error}</div>
        ) : null}

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="primary" type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Creating...' : 'Sign Up'}
          </Button>
          <Link to="/login" className="btn btn-ghost" style={{ alignSelf: 'center' }}>Already have an account?</Link>
        </div>
      </form>
    </div>
  );
}
