import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { authFailure, authSuccess, startAuth } from '../../state/slices/authSlice';
import { getSupabaseClient } from '../../lib/supabaseClient';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(startAuth());

    try {
      if (!name || !email || !password) {
        dispatch(authFailure('All fields are required.'));
        return;
      }

      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/auth/callback',
          data: {
            name,
            role, // store minimal role in user_metadata
          },
        },
      });

      if (error) {
        dispatch(authFailure(error.message || 'Failed to register.'));
        return;
      }

      // Depending on project settings, signUp may require email confirmation.
      // If session is present immediately, log user in, else show message and navigate to login.
      const session = data?.session;
      const profile = data?.user || session?.user;
      if (session && profile) {
        const token = session?.access_token || null;
        const derivedRole =
          profile?.app_metadata?.role ||
          profile?.user_metadata?.role ||
          role ||
          'member';

        const user = {
          id: profile.id,
          name: profile.user_metadata?.name || name || profile.email || 'User',
          email: profile.email || email,
          role: derivedRole,
        };

        dispatch(authSuccess({ user, token }));
        if (derivedRole === 'owner') navigate('/owner', { replace: true });
        else if (derivedRole === 'trainer') navigate('/trainer', { replace: true });
        else navigate('/member', { replace: true });
      } else {
        // No session -> likely email confirmation required
        dispatch(authFailure(null));
        alert('Check your email to confirm your account, then sign in.');
        navigate('/login', { replace: true });
      }
    } catch (err) {
      dispatch(authFailure(err?.message || 'Failed to register.'));
    }
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

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="primary" type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Creating...' : 'Sign Up'}
          </Button>
          <Button
            variant="secondary"
            type="button"
            onClick={async () => {
              const supabase = getSupabaseClient();
              await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                  redirectTo: window.location.origin + '/auth/callback',
                },
              });
            }}
          >
            Continue with Google
          </Button>
          <Link to="/login" className="btn btn-ghost" style={{ alignSelf: 'center' }}>Already have an account?</Link>
        </div>
      </form>
    </div>
  );
}
