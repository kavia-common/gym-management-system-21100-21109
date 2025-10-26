import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { authSuccess } from '../../state/slices/authSlice';

/**
 * PUBLIC_INTERFACE
 * ProtectedRoute - Local stubbed protection. By default allows access.
 * - Uses localStorage 'auth_stub' to optionally gate.
 * - If 'auth_stub' is present and no Redux token, it seeds a dummy auth.
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);

  React.useEffect(() => {
    // If a stub flag is set, ensure Redux has a minimal auth state
    const stub = localStorage.getItem('auth_stub');
    if (stub && !token) {
      try {
        const parsed = JSON.parse(stub);
        const role = parsed?.role || 'member';
        dispatch(
          authSuccess({
            token: 'local-stub-token',
            user: {
              id: 'stub-user',
              name: parsed?.name || 'Local User',
              email: parsed?.email || 'local@example.com',
              role,
            },
          })
        );
      } catch {
        dispatch(
          authSuccess({
            token: 'local-stub-token',
            user: { id: 'stub-user', name: 'Local User', email: '', role: 'member' },
          })
        );
      }
    }
  }, [dispatch, token]);

  // If you want to fully allow access regardless of auth, just return children.
  // If you want a soft gate, uncomment the redirect below and rely on auth_stub.
  // if (!token && !localStorage.getItem('auth_stub')) {
  //   return <Navigate to="/login" replace state={{ from: location }} />;
  // }

  return children;
}
