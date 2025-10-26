import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authSuccess } from '../../state/slices/authSlice';
import { getCurrentSession } from '../../lib/authStub';

/**
 * PUBLIC_INTERFACE
 * AuthCallback - Stubbed callback page. No external API calls.
 * Reads session from local storage and routes accordingly. If missing, routes to /login.
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  React.useEffect(() => {
    const stub = getCurrentSession();
    if (stub) {
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
    }
    navigate('/login', { replace: true });
  }, [dispatch, navigate]);

  return (
    <div className="container" style={{ padding: 24 }}>
      Completing sign-in (stub)...
    </div>
  );
}
