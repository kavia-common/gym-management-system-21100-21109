import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authSuccess } from '../../state/slices/authSlice';
import { supabase } from '../../lib/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * AuthCallback - Handles redirect after verification or magic link if applicable.
 * Reads current Supabase session and routes accordingly. If missing, routes to /login.
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  React.useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data?.session || null;
      const profile = session?.user || null;

      if (session && profile) {
        const resolvedRole =
          profile?.app_metadata?.role ||
          profile?.user_metadata?.role ||
          'member';

        dispatch(
          authSuccess({
            token: session?.access_token || null,
            user: {
              id: profile?.id,
              name: profile?.user_metadata?.name || profile?.email || 'User',
              email: profile?.email || '',
              role: resolvedRole,
            },
          })
        );

        if (resolvedRole === 'owner') navigate('/owner', { replace: true });
        else if (resolvedRole === 'trainer') navigate('/trainer', { replace: true });
        else navigate('/member', { replace: true });
        return;
      }
      navigate('/login', { replace: true });
    };
    run();
  }, [dispatch, navigate]);

  return (
    <div className="container" style={{ padding: 24 }}>
      Completing sign-in...
    </div>
  );
}
