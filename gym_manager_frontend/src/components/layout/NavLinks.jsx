import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * NavLinks component renders role-aware navigation links.
 * - Public links for unauthenticated users
 * - Role-specific links for authenticated users (Member, Trainer, Owner/Admin)
 * - Supports both desktop and mobile layouts
 */
export default function NavLinks({ isAuthenticated, userRole, isMobile = false }) {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const linkStyle = (path) => ({
    textDecoration: 'none',
    color: isActive(path) ? '#2563EB' : '#374151',
    fontWeight: isActive(path) ? 600 : 500,
    padding: isMobile ? '12px 16px' : '8px 16px',
    borderRadius: 8,
    backgroundColor: isActive(path) ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
    transition: 'all 0.2s ease',
    display: isMobile ? 'block' : 'inline-block',
    width: isMobile ? '100%' : 'auto',
  });

  const handleMouseEnter = (e) => {
    if (!isActive(e.currentTarget.getAttribute('data-path'))) {
      e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.05)';
      e.currentTarget.style.color = '#2563EB';
    }
  };

  const handleMouseLeave = (e) => {
    if (!isActive(e.currentTarget.getAttribute('data-path'))) {
      e.currentTarget.style.backgroundColor = 'transparent';
      e.currentTarget.style.color = '#374151';
    }
  };

  const handleFocus = (e) => {
    e.currentTarget.style.outline = '2px solid #2563EB';
    e.currentTarget.style.outlineOffset = '2px';
  };

  const handleBlur = (e) => {
    e.currentTarget.style.outline = 'none';
  };

  // Public links (not authenticated)
  if (!isAuthenticated) {
    return (
      <>
        <Link
          to="/"
          style={linkStyle('/')}
          data-path="/"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-current={isActive('/') ? 'page' : undefined}
        >
          Home
        </Link>
        <Link
          to="/plans"
          style={linkStyle('/plans')}
          data-path="/plans"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-current={isActive('/plans') ? 'page' : undefined}
        >
          Plans
        </Link>
        <Link
          to="/get-started"
          style={linkStyle('/get-started')}
          data-path="/get-started"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-current={isActive('/get-started') ? 'page' : undefined}
        >
          Get Started
        </Link>
      </>
    );
  }

  // Member links
  if (userRole === 'member') {
    return (
      <>
        <Link
          to="/member/classes"
          style={linkStyle('/member/classes')}
          data-path="/member/classes"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-current={isActive('/member/classes') ? 'page' : undefined}
        >
          Classes
        </Link>
        <Link
          to="/plans"
          style={linkStyle('/plans')}
          data-path="/plans"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-current={isActive('/plans') ? 'page' : undefined}
        >
          Plans
        </Link>
        <Link
          to="/member"
          style={linkStyle('/member')}
          data-path="/member"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-current={isActive('/member') && !isActive('/member/') ? 'page' : undefined}
        >
          Dashboard
        </Link>
      </>
    );
  }

  // Trainer links
  if (userRole === 'trainer') {
    return (
      <>
        <Link
          to="/trainer/timetable"
          style={linkStyle('/trainer/timetable')}
          data-path="/trainer/timetable"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-current={isActive('/trainer/timetable') ? 'page' : undefined}
        >
          Classes
        </Link>
        <Link
          to="/trainer/clients"
          style={linkStyle('/trainer/clients')}
          data-path="/trainer/clients"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-current={isActive('/trainer/clients') ? 'page' : undefined}
        >
          My Members
        </Link>
        <Link
          to="/trainer"
          style={linkStyle('/trainer')}
          data-path="/trainer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-current={isActive('/trainer') && !isActive('/trainer/') ? 'page' : undefined}
        >
          Dashboard
        </Link>
      </>
    );
  }

  // Owner/Admin links
  if (userRole === 'owner') {
    return (
      <>
        <Link
          to="/owner/members"
          style={linkStyle('/owner/members')}
          data-path="/owner/members"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-current={isActive('/owner/members') ? 'page' : undefined}
        >
          Members
        </Link>
        <Link
          to="/owner/analytics"
          style={linkStyle('/owner/analytics')}
          data-path="/owner/analytics"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-current={isActive('/owner/analytics') ? 'page' : undefined}
        >
          Reports
        </Link>
        <Link
          to="/owner"
          style={linkStyle('/owner')}
          data-path="/owner"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-current={isActive('/owner') && !isActive('/owner/') ? 'page' : undefined}
        >
          Dashboard
        </Link>
      </>
    );
  }

  // Fallback for authenticated users without a recognized role
  return (
    <Link
      to="/dashboard"
      style={linkStyle('/dashboard')}
      data-path="/dashboard"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      aria-current={isActive('/dashboard') ? 'page' : undefined}
    >
      Dashboard
    </Link>
  );
}
