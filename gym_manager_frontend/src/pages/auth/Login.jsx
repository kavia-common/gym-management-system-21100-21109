import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

/**
 * Simple placeholder Login page.
 * Replace with real form and auth handling later.
 */
export default function Login() {
  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Login</h2>
      <p style={{ color: 'var(--color-text-muted)' }}>Enter your credentials to access your dashboard.</p>
      <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
        <Input label="Email" type="email" placeholder="you@example.com" />
        <Input label="Password" type="password" placeholder="••••••••" />
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Button variant="primary">Sign In</Button>
          <Link to="/register" className="btn btn-ghost">Create an account</Link>
        </div>
      </div>
    </div>
  );
}
