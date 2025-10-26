import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { authSuccess } from '../../state/slices/authSlice';
import { ensureStubAuthInRedux } from '../../lib/authStub';

/**
 * PUBLIC_INTERFACE
 * ProtectedRoute - Seeds Redux from local stub session if found.
 * In stub mode we allow access; optionally redirect to /login if no session and token.
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);

  React.useEffect(() => {
    if (!token) {
      ensureStubAuthInRedux((s) => {
        dispatch(
          authSuccess({
            token: 'local-stub-token',
            user: {
              id: 'stub-user',
              name: s?.name || 'Local User',
              email: s?.email || '',
              role: s?.role || 'member',
            },
          })
        );
      });
    }
  }, [dispatch, token]);

  // Soft gate: keep permissive to avoid blocking during stubbed development
  // If desired, enforce login when no token and no session present:
  // const noSession = !token && !getCurrentSession();
  // if (noSession) return <Navigate to="/login" replace state={{ from: location }} />;

  return children;
}
