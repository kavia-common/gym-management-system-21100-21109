import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../../styles/theme.css';
import Button from '../ui/Button';
import { logout } from '../../state/slices/authSlice';
import { supabase } from '../../lib/supabaseClient';

/**
 * TopNav aligned with Ocean Professional theme.
 * Includes a hamburger to toggle the responsive sidebar (dispatches 'toggle-sidenav' event).
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

  return (
    <header className="topnav u-gradient-soft">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          aria-label="Toggle menu"
          onClick={toggleSidenav}
          className="btn btn-ghost"
          style={{ padding: '6px 10px' }}
        >
          ☰
        </button>
        <div className="topnav-brand">Gym Manager</div>
      </div>
      <div className="topnav-actions">
        <span>{user ? `Welcome, ${user.name}` : 'Welcome'}</span>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--color-secondary)' }} />
        {user ? <Button variant="secondary" onClick={onLogout}>Logout</Button> : null}
      </div>
    </header>
  );
}
