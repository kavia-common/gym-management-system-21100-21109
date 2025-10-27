import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * ResetPassword
 * - Handles Supabase recovery redirect (type=recovery) and allows user to set a new password.
 * - Provides clear error/success messaging and loading states.
 */
export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const cameFromRecovery = useMemo(() => {
    try {
      const params = new URLSearchParams(location.search);
      return params.get('type') === 'recovery' || params.get('from') === 'recovery';
    } catch {
      return false;
    }
  }, [location.search]);

  useEffect(() => {
    if (!supabase || !supabase.auth) {
      setError('Authentication is not configured. Please contact support.');
    }
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      setSaving(false);
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      setSaving(false);
      return;
    }

    try {
      if (!supabase?.auth?.updateUser) {
        throw new Error('Authentication is not available.');
      }
      const { error: sbError } = await supabase.auth.updateUser({ password });
      if (sbError) throw sbError;
      setMessage('Password updated successfully. You can now sign in.');
      setTimeout(() => navigate('/login', { replace: true }), 900);
    } catch (err: any) {
      setError(err?.message || 'An error occurred updating your password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container" style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}>
        <h1 style={{ marginTop: 0 }}>Reset Password</h1>
        <p style={{ color: '#6b7280', marginTop: 4 }}>
          {cameFromRecovery
            ? 'You have verified your email. Set a new password below.'
            : 'Enter a new password for your account.'}
        </p>
        {message ? (
          <div style={{ padding: '10px 12px', borderRadius: 8, background: '#d1fae5', border: '1px solid #a7f3d0', color: '#065f46', marginBottom: 12 }}>
            {message}
          </div>
        ) : null}
        {error ? (
          <div style={{ padding: '10px 12px', borderRadius: 8, background: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', marginBottom: 12 }}>
            {error}
          </div>
        ) : null}
        <form onSubmit={onSubmit}>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
            style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #e5e7eb', marginBottom: 10 }}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            minLength={6}
            required
            style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #e5e7eb', marginBottom: 16 }}
          />
          <button disabled={saving} type="submit" style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: 'none', background: '#2563EB', color: '#fff', fontWeight: 600 }}>
            {saving ? 'Saving...' : 'Save password'}
          </button>
        </form>
        <div style={{ marginTop: 10 }}>
          <button type="button" onClick={() => navigate('/login')} style={{ background: 'transparent', color: '#2563EB', border: 'none', cursor: 'pointer' }}>
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
}
