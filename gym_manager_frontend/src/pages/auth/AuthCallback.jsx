import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authSuccess } from '../../state/slices/authSlice';
import { supabase } from '../../lib/supabaseClient';
import { profilesService } from '../../services/supabase';

/**
 * PUBLIC_INTERFACE
 * AuthCallback - Handles redirect after verification or magic link if applicable.
 * Reads current Supabase session, fetches profile for role/status, and routes accordingly.
 * If trainer status !== 'active', redirects to /login with message.
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  React.useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data?.session || null;
      const authUser = session?.user || null;

      if (session && authUser) {
        let profileRow = null;
        try {
          profileRow = await profilesService.getById(authUser.id);
        } catch {
          // ignore
        }

        const resolvedRole =
          profileRow?.role ||
          authUser?.app_metadata?.role ||
          authUser?.user_metadata?.role ||
          'member';

        const status = profileRow?.status || (resolvedRole === 'trainer' ? 'pending' : 'active');

        // Block trainer if not active
        if (resolvedRole === 'trainer' && status !== 'active') {
          navigate('/login', { replace: true, state: { msg: 'Your trainer account is pending approval. Access will be granted once approved.' } });
          return;
        }

        dispatch(
          authSuccess({
            token: session?.access_token || null,
            user: {
              id: authUser?.id,
              name: authUser?.user_metadata?.name || profileRow?.name || authUser?.email || 'User',
              email: authUser?.email || '',
              role: resolvedRole,
              status,
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
