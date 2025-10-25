import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authSuccess, logout } from '../../state/slices/authSlice';
import { getSupabaseClient } from '../../lib/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * ProtectedRoute - Guards routes that require authentication.
 * If no token is present, redirects to /login preserving the original location in state.from.
 */
export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);
  const location = useLocation();

  React.useEffect(() => {
    const supabase = getSupabaseClient();

    // Bootstrap current session on mount if Redux empty
    (async () => {
      if (!token) {
        const { data } = await supabase.auth.getSession();
        const session = data?.session;
        const profile = session?.user;
        if (session && profile) {
          const role =
            profile?.app_metadata?.role ||
            profile?.user_metadata?.role ||
            'member';
          dispatch(
            authSuccess({
              token: session.access_token,
              user: {
                id: profile.id,
                name: profile.user_metadata?.name || profile.email || 'User',
                email: profile.email || '',
                role,
              },
            })
          );
        }
      }
    })();

    // Subscribe to auth changes
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token && session.user) {
        const profile = session.user;
        const role =
          profile?.app_metadata?.role ||
          profile?.user_metadata?.role ||
          'member';
        dispatch(
          authSuccess({
            token: session.access_token,
            user: {
              id: profile.id,
              name: profile.user_metadata?.name || profile.email || 'User',
              email: profile.email || '',
              role,
            },
          })
        );
      } else if (event === 'SIGNED_OUT') {
        dispatch(logout());
      }
    });

    return () => {
      sub?.subscription?.unsubscribe?.();
    };
  }, [dispatch, token]);

  if (!token) {
    // Redirect unauthenticated users to login page with the intended path
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
