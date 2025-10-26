import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * Header renders a simple top navigation with auth-aware actions.
 * - When logged out: Home, Plans, Get Started, Login, Sign up
 * - When logged in: Dashboard, Logout
 */
export default function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '12px 16px',
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        <Link to="/" style={{ textDecoration: 'none', color: '#111827', fontWeight: 700 }}>
          Gym Manager
        </Link>

        <nav style={{ display: 'flex', gap: 12, marginLeft: 16 }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#374151' }}>Home</Link>
          <Link to="/plans" style={{ textDecoration: 'none', color: '#374151' }}>Plans</Link>
          <Link to="/get-started" style={{ textDecoration: 'none', color: '#374151' }}>Get Started</Link>
        </nav>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
          {!user ? (
            <>
              <Link
                to="/login"
                style={{
                  textDecoration: 'none',
                  color: '#2563EB',
                  fontWeight: 600,
                }}
              >
                Login
              </Link>
              <Link
                to="/get-started"
                style={{
                  textDecoration: 'none',
                  color: '#ffffff',
                  background: '#2563EB',
                  padding: '8px 12px',
                  borderRadius: 8,
                  fontWeight: 600,
                }}
                aria-label="Start registration"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/member"
                style={{
                  textDecoration: 'none',
                  color: '#2563EB',
                  fontWeight: 600,
                }}
              >
                Dashboard
              </Link>
              <button
                onClick={onLogout}
                type="button"
                style={{
                  border: '1px solid #e5e7eb',
                  background: '#ffffff',
                  color: '#111827',
                  borderRadius: 8,
                  padding: '6px 10px',
                  cursor: 'pointer',
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
