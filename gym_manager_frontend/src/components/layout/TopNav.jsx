import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import '../../styles/theme.css';
import Button from '../ui/Button';
import { logout } from '../../state/slices/authSlice';

let supabase = null;
try {
  // eslint-disable-next-line global-require
  supabase = require('../../lib/supabaseClient').supabase;
} catch {
  // ignore, show minimal UI
}

/**
 * TopNav aligned with Ocean Professional theme.
 * Includes Home link and a hamburger to toggle the responsive sidebar (dispatches 'toggle-sidenav' event).
 */
export default function TopNav() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);

  const toggleSidenav = () => {
    window.dispatchEvent(new CustomEvent('toggle-sidenav'));
  };

  const onLogout = async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[Supabase] signOut warning:', e?.message || e);
    } finally {
      dispatch(logout());
      navigate('/login', { replace: true });
    }
  };

  const linkStyle = ({ isActive }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 10px',
    borderRadius: 8,
    color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
    background: isActive ? 'rgba(37,99,235,0.10)' : 'transparent',
    textDecoration: 'none',
    fontWeight: 600,
  });

  return (
    <header className="topnav u-gradient-soft" aria-label="Top navigation bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          aria-label="Toggle menu"
          onClick={toggleSidenav}
          className="btn btn-ghost"
          style={{ padding: '6px 10px' }}
        >
          ☰
        </button>
        <Link to="/" className="topnav-brand" aria-label="Go to home page">Gym Manager</Link>
      </div>

      <nav aria-label="Primary">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <NavLink to="/" end style={linkStyle} aria-label="Home">Home</NavLink>
          <NavLink to="/member" style={linkStyle} aria-label="Member portal">Member</NavLink>
          <NavLink to="/trainer" style={linkStyle} aria-label="Trainer portal">Trainer</NavLink>
          <NavLink to="/owner" style={linkStyle} aria-label="Owner portal">Owner</NavLink>
        </div>
      </nav>

      <div className="topnav-actions">
        <span>{user ? `Welcome, ${user.name}` : 'Welcome'}</span>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--color-secondary)' }} />
        {user ? <Button variant="secondary" onClick={onLogout} aria-label="Logout">Logout</Button> : null}
      </div>
    </header>
  );
}
