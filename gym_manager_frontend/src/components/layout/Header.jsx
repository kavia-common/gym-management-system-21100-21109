import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSelector } from 'react-redux';
import NavLinks from './NavLinks';
import UserMenu from './UserMenu';
import MobileDrawer from './MobileDrawer';

/**
 * PUBLIC_INTERFACE
 * Header component with Ocean Professional styling.
 * - Sticky positioning with shadow
 * - Responsive design with mobile hamburger menu
 * - Role-aware navigation links
 * - Auth-aware actions (Login/Signup vs Avatar menu)
 * - Keyboard accessible with proper focus states
 */
export default function Header() {
  const { user } = useAuth();
  const reduxUser = useSelector((s) => s.auth?.user);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Combine auth sources: useAuth for session, Redux for role
  const isAuthenticated = !!user;
  const userRole = reduxUser?.role || null;

  // Track scroll for enhanced shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileOpen]);

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <header
        className="app-header"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(249, 250, 251, 1) 100%)',
          borderBottom: '1px solid rgba(229, 231, 235, 0.8)',
          boxShadow: scrolled ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            padding: '14px 24px',
            maxWidth: 1280,
            margin: '0 auto',
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              color: '#2563EB',
              fontWeight: 700,
              fontSize: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            aria-label="Gym Manager Home"
          >
            <span style={{ fontSize: '1.5rem' }}>💪</span>
            <span>Gym Manager</span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="desktop-nav"
            style={{
              display: 'flex',
              gap: 8,
              marginLeft: 24,
              flex: 1,
            }}
            aria-label="Main navigation"
          >
            <NavLinks isAuthenticated={isAuthenticated} userRole={userRole} isMobile={false} />
          </nav>

          {/* Desktop Auth Actions */}
          <div
            className="desktop-auth-actions"
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'center',
            }}
          >
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  style={{
                    textDecoration: 'none',
                    color: '#2563EB',
                    fontWeight: 600,
                    padding: '8px 16px',
                    borderRadius: 8,
                    transition: 'background-color 0.2s ease, transform 0.1s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = '2px solid #2563EB';
                    e.currentTarget.style.outlineOffset = '2px';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = 'none';
                  }}
                  aria-label="Login to your account"
                >
                  Login
                </Link>
                <Link
                  to="/get-started"
                  style={{
                    textDecoration: 'none',
                    color: '#ffffff',
                    background: '#2563EB',
                    padding: '10px 20px',
                    borderRadius: 8,
                    fontWeight: 600,
                    boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)',
                    transition: 'background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1d4ed8';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(37, 99, 235, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#2563EB';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(37, 99, 235, 0.2)';
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = '2px solid #F59E0B';
                    e.currentTarget.style.outlineOffset = '2px';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = 'none';
                  }}
                  aria-label="Start registration"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <UserMenu user={user} userRole={userRole} />
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="mobile-menu-button"
            style={{
              display: 'none',
              border: 'none',
              background: 'transparent',
              padding: 8,
              cursor: 'pointer',
              borderRadius: 8,
              transition: 'background-color 0.2s ease',
            }}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-drawer"
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
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        isAuthenticated={isAuthenticated}
        userRole={userRole}
        user={user}
      />
    </>
  );
}
