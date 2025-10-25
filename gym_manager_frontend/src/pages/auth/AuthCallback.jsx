import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authSuccess, authFailure } from '../../state/slices/authSlice';
import { getSupabaseClient } from '../../lib/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * AuthCallback - Handles the Supabase OAuth/email magic link redirect, extracts the session,
 * stores minimal user and token in Redux, then redirects to a sensible dashboard based on role.
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  React.useEffect(() => {
    async function handleCallback() {
      const supabase = getSupabaseClient();

      // Try to get existing session; Supabase SDK handles parsing hash fragments
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        dispatch(authFailure(error.message || 'Authentication failed.'));
        navigate('/login', { replace: true });
        return;
      }

      const session = data?.session;
      const accessToken = session?.access_token || null;
      const profile = session?.user || null;

      if (!session || !profile) {
        dispatch(authFailure('No active session.'));
        navigate('/login', { replace: true });
        return;
      }

      // Derive role from user metadata if exists, fallback to 'member'
      const role =
        profile?.app_metadata?.role ||
        profile?.user_metadata?.role ||
        'member';

      const minimalUser = {
        id: profile.id,
        name: profile.user_metadata?.name || profile.email || 'User',
        email: profile.email || '',
        role,
      };

      dispatch(authSuccess({ user: minimalUser, token: accessToken }));

      // Navigate based on role
      if (role === 'owner') navigate('/owner', { replace: true });
      else if (role === 'trainer') navigate('/trainer', { replace: true });
      else navigate('/member', { replace: true });
    }

    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container" style={{ padding: 24 }}>
      Completing sign-in...
    </div>
  );
}
