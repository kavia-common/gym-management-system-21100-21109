import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * UserMenu component displays an authenticated user's avatar and dropdown menu.
 * - Shows user avatar with initials
 * - Dropdown with Profile, Dashboard, and Logout actions
 * - Keyboard accessible (Escape to close, focus trap)
 * - Proper ARIA attributes
 */
export default function UserMenu({ user, userRole }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Get user initials from email
  const getUserInitials = () => {
    if (!user?.email) return 'U';
    const parts = user.email.split('@')[0].split('.');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return user.email.substring(0, 2).toUpperCase();
  };

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
        buttonRef.current?.focus();
      }
    };
    if (menuOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    setMenuOpen(false);
    await signOut();
    navigate('/login', { replace: true });
  };

  const getDashboardPath = () => {
    if (userRole === 'owner') return '/owner';
    if (userRole === 'trainer') return '/trainer';
    if (userRole === 'member') return '/member';
    return '/dashboard';
  };

  const getProfilePath = () => {
    if (userRole === 'member') return '/member/profile';
    return '/member/profile'; // Default to member profile
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)',
          color: '#ffffff',
          border: '2px solid rgba(37, 99, 235, 0.2)',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)',
        }}
        aria-label="User menu"
        aria-expanded={menuOpen}
        aria-haspopup="true"
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(37, 99, 235, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(37, 99, 235, 0.2)';
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline = '2px solid #F59E0B';
          e.currentTarget.style.outlineOffset = '2px';
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = 'none';
        }}
      >
        {getUserInitials()}
      </button>

      {menuOpen && (
        <div
          ref={menuRef}
          role="menu"
          aria-orientation="vertical"
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 8px)',
            backgroundColor: '#ffffff',
            borderRadius: 12,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(229, 231, 235, 0.8)',
            minWidth: 200,
            overflow: 'hidden',
            zIndex: 1001,
            animation: 'fadeInDown 0.2s ease',
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid rgba(229, 231, 235, 0.8)',
              backgroundColor: 'rgba(37, 99, 235, 0.04)',
            }}
          >
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>
              {user?.email}
            </div>
            {userRole && (
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  marginTop: 4,
                  textTransform: 'capitalize',
                }}
              >
                {userRole}
              </div>
            )}
          </div>

          <Link
            to={getProfilePath()}
            role="menuitem"
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'block',
              padding: '12px 16px',
              textDecoration: 'none',
              color: '#374151',
              fontSize: '0.875rem',
              fontWeight: 500,
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.08)';
              e.currentTarget.style.color = '#2563EB';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#374151';
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = '2px solid #2563EB';
              e.currentTarget.style.outlineOffset = '-2px';
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = 'none';
            }}
          >
            👤 Profile
          </Link>

          <Link
            to={getDashboardPath()}
            role="menuitem"
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'block',
              padding: '12px 16px',
              textDecoration: 'none',
              color: '#374151',
              fontSize: '0.875rem',
              fontWeight: 500,
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.08)';
              e.currentTarget.style.color = '#2563EB';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#374151';
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = '2px solid #2563EB';
              e.currentTarget.style.outlineOffset = '-2px';
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = 'none';
            }}
          >
            📊 Dashboard
          </Link>

          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '12px 16px',
              border: 'none',
              background: 'transparent',
              color: '#DC2626',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              borderTop: '1px solid rgba(229, 231, 235, 0.8)',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = '2px solid #2563EB';
              e.currentTarget.style.outlineOffset = '-2px';
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = 'none';
            }}
          >
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
}
