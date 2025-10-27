import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage('Password updated successfully.');
    } catch (err: any) {
      setMessage(err?.message || 'An error occurred updating your password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <h1>Reset Password</h1>
      <form onSubmit={onSubmit}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button disabled={saving} type="submit">{saving ? 'Saving...' : 'Save password'}</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
