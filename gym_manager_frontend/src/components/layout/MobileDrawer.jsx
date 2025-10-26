import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NavLinks from './NavLinks';

/**
 * PUBLIC_INTERFACE
 * MobileDrawer component provides a slide-in navigation drawer for mobile devices.
 * - Animated slide-in from right
 * - Backdrop overlay
 * - Focus trap within drawer
 * - Escape key closes drawer
 * - Role-aware navigation
 * - Auth-aware actions
 */
export default function MobileDrawer({ isOpen, onClose, isAuthenticated, userRole, user }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const drawerRef = useRef(null);
  const firstFocusableRef = useRef(null);

  // Get user initials
  const getUserInitials = () => {
    if (!user?.email) return 'U';
    const parts = user.email.split('@')[0].split('.');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return user.email.substring(0, 2).toUpperCase();
  };

  // Focus trap within drawer
  useEffect(() => {
    if (isOpen && drawerRef.current) {
      const focusableElements = drawerRef.current.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      firstFocusableRef.current = firstElement;

      const handleTab = (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement?.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement?.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleTab);
      // Auto-focus first element
      setTimeout(() => firstElement?.focus(), 100);

      return () => {
        document.removeEventListener('keydown', handleTab);
      };
    }
  }, [isOpen]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLogout = async () => {
    onClose();
    await signOut();
    navigate('/login', { replace: true });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          animation: 'fadeIn 0.3s ease',
        }}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '80%',
          maxWidth: 320,
          backgroundColor: '#ffffff',
          boxShadow: '-4px 0 10px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.3s ease',
          overflow: 'auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid rgba(229, 231, 235, 0.8)',
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(249, 250, 251, 1) 100%)',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: '1.125rem', color: '#2563EB' }}>
            Menu
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              padding: 8,
              cursor: 'pointer',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Close menu"
            onFocus={(e) => {
              e.currentTarget.style.outline = '2px solid #2563EB';
              e.currentTarget.style.outlineOffset = '2px';
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = 'none';
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: '#111827' }}
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* User Info (if authenticated) */}
        {isAuthenticated && user && (
          <div
            style={{
              padding: '20px',
              borderBottom: '1px solid rgba(229, 231, 235, 0.8)',
              backgroundColor: 'rgba(37, 99, 235, 0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '1rem',
                }}
              >
                {getUserInitials()}
              </div>
              <div>
                <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem' }}>
                  {user.email}
                </div>
                {userRole && (
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      marginTop: 2,
                      textTransform: 'capitalize',
                    }}
                  >
                    {userRole}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav
          style={{
            flex: 1,
            padding: '16px 0',
          }}
          aria-label="Mobile navigation"
        >
          <NavLinks isAuthenticated={isAuthenticated} userRole={userRole} isMobile={true} />
        </nav>

        {/* Auth Actions */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid rgba(229, 231, 235, 0.8)',
            backgroundColor: 'rgba(249, 250, 251, 1)',
          }}
        >
          {!isAuthenticated ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link
                to="/login"
                onClick={onClose}
                style={{
                  textDecoration: 'none',
                  color: '#2563EB',
                  fontWeight: 600,
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '2px solid #2563EB',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  display: 'block',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = '2px solid #F59E0B';
                  e.currentTarget.style.outlineOffset = '2px';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = 'none';
                }}
              >
                Login
              </Link>
              <Link
                to="/get-started"
                onClick={onClose}
                style={{
                  textDecoration: 'none',
                  color: '#ffffff',
                  background: '#2563EB',
                  padding: '12px 16px',
                  borderRadius: 8,
                  fontWeight: 600,
                  textAlign: 'center',
                  boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)',
                  transition: 'all 0.2s ease',
                  display: 'block',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = '2px solid #F59E0B';
                  e.currentTarget.style.outlineOffset = '2px';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = 'none';
                }}
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #DC2626',
                background: 'transparent',
                color: '#DC2626',
                borderRadius: 8,
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.9375rem',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#DC2626';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#DC2626';
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = '2px solid #F59E0B';
                e.currentTarget.style.outlineOffset = '2px';
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = 'none';
              }}
            >
              🚪 Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
}
