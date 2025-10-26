import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authSuccess } from '../../state/slices/authSlice';

/**
 * PUBLIC_INTERFACE
 * AuthCallback - Stubbed callback page. No external API calls.
 * Reads any localStorage 'auth_stub' and routes accordingly. If missing, routes to /login.
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  React.useEffect(() => {
    const raw = localStorage.getItem('auth_stub');
    if (raw) {
      try {
        const stub = JSON.parse(raw);
        const role = stub?.role || 'member';
        dispatch(
          authSuccess({
            token: 'local-stub-token',
            user: {
              id: 'stub-user',
              name: stub?.name || 'Local User',
              email: stub?.email || '',
              role,
            },
          })
        );
        if (role === 'owner') navigate('/owner', { replace: true });
        else if (role === 'trainer') navigate('/trainer', { replace: true });
        else navigate('/member', { replace: true });
        return;
      } catch {
        // fallthrough
      }
    }
    navigate('/login', { replace: true });
  }, [dispatch, navigate]);

  return (
    <div className="container" style={{ padding: 24 }}>
      Completing sign-in (stub)...
    </div>
  );
}
