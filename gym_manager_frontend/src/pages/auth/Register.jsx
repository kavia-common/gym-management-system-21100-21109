import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { authFailure, authSuccess, startAuth } from '../../state/slices/authSlice';
import { supabase } from '../../lib/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * Register page using Supabase signUp exclusively.
 * If email confirmation is enabled (no session), navigates user to login after showing info message.
 */
export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector((s) => s.auth.status);
  const error = useSelector((s) => s.auth.error);

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(startAuth());

    if (!name || !email || !password) {
      dispatch(authFailure('All fields are required.'));
      return;
    }

    try {
      const { data, error: sbError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            name,
            // Default new users to member role; owners/trainers can be promoted server-side.
            role: 'member',
          },
        },
      });

      if (sbError) {
        dispatch(authFailure(sbError.message || 'Registration failed.'));
        return;
      }

      const session = data?.session || null;
      const profile = data?.user || null;

      if (!session) {
        // Inform user to verify email and then sign in
        dispatch(authFailure('Registration successful. Please check your email to confirm your account, then sign in.'));
        navigate('/login', { replace: true });
        return;
      }

      const token = session?.access_token || null;
      const resolvedRole =
        profile?.app_metadata?.role ||
        profile?.user_metadata?.role ||
        'member';

      const user = {
        id: profile?.id,
        name: profile?.user_metadata?.name || name,
        email: profile?.email || email,
        role: resolvedRole,
      };

      dispatch(authSuccess({ user, token }));

      if (resolvedRole === 'owner') navigate('/owner', { replace: true });
      else if (resolvedRole === 'trainer') navigate('/trainer', { replace: true });
      else navigate('/member', { replace: true });
    } catch (err) {
      dispatch(authFailure(err?.message || 'Registration failed.'));
    }
  };

  // Defensive UI if envs are missing and client failed to init (module would have thrown).
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
      <h2 style={{ marginTop: 0 }}>Register</h2>
      <p style={{ color: 'var(--color-text-muted)' }}>Create your Gym Manager account.</p>
      {envWarning}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, marginTop: 12 }}>
        <Input label="Full Name" placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Password" type="password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} />

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
