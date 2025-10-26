import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * Login page (TypeScript) with Ocean Professional theme and accessible UI.
 * Preserves the existing auth API: useAuth().signIn({ email, password }).
 * - Email/password fields with validation and clear error states
 * - Password visibility toggle
 * - "Forgot password" link to /forgot-password (per routing)
 * - "Create account" link to /get-started
 * - Responsive card layout with subtle gradient background
 * - Loading state on submit and success redirect handling
 * - Keyboard navigation and ARIA labels
 * - Optional disabled social login buttons as placeholders
 */
export default function Login() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ email: string; password: string; form: string }>({
    email: '',
    password: '',
    form: '',
  });

  const redirectTo = location.state?.from?.pathname || '/dashboard';

  const theme = useMemo(
    () => ({
      primary: '#2563EB',
      secondary: '#F59E0B',
      error: '#EF4444',
      surface: '#ffffff',
      text: '#111827',
    }),
    []
  );

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, navigate, redirectTo]);

  const validate = () => {
    const next = { email: '', password: '', form: '' };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) next.email = 'Email is required.';
    else if (!emailRegex.test(email.trim())) next.email = 'Please enter a valid email address.';

    if (!password) next.password = 'Password is required.';
    else if (password.length < 6) next.password = 'Password must be at least 6 characters.';

    setErrors(next);
    return !next.email && !next.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors((prev) => ({ ...prev, form: '' }));

    if (!validate()) return;

    setSubmitting(true);
    try {
      const { error } = await signIn({ email: email.trim(), password });
      if (error) {
        setErrors((prev) => ({
          ...prev,
          form: error || 'We could not sign you in. Please check your credentials and try again.',
        }));
        return;
      }
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        form:
          (err?.message && String(err.message)) ||
          'We could not sign you in. Please check your credentials and try again.',
      }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{
        background:
          'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(243,244,246,1) 100%)',
      }}
    >
      <div className="w-full max-w-md">
        <div
          className="bg-white rounded-2xl shadow-xl border"
          style={{ borderColor: 'rgba(37,99,235,0.12)' }}
          role="region"
          aria-labelledby="login-title"
        >
          <div className="px-6 sm:px-8 pt-6 sm:pt-8">
            <div className="mb-6 sm:mb-8 text-center">
              <div
                className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3"
                style={{
                  backgroundColor: 'rgba(37,99,235,0.1)',
                  color: theme.primary,
                }}
              >
                <svg
                  aria-hidden
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 5v5.59l3.3 3.3-1.42 1.42L11 13.41V7h2z" />
                </svg>
              </div>
              <h1
                id="login-title"
                className="text-2xl sm:text-3xl font-semibold"
                style={{ color: theme.text }}
              >
                Welcome back
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Sign in to access your gym dashboard.
              </p>
            </div>

            {errors.form ? (
              <div
                className="mb-4 rounded-lg px-4 py-3 text-sm"
                role="alert"
                aria-live="assertive"
                style={{
                  color: theme.error,
                  backgroundColor: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.2)',
                }}
              >
                {errors.form}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.text }}
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition shadow-sm"
                  style={{
                    borderColor: errors.email
                      ? theme.error
                      : 'rgba(17,24,39,0.15)',
                    boxShadow:
                      '0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)',
                  }}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={validate}
                  required
                />
                {errors.email ? (
                  <p
                    id="email-error"
                    className="mt-1 text-xs"
                    style={{ color: theme.error }}
                    role="alert"
                  >
                    {errors.email}
                  </p>
                ) : null}
              </div>

              <div className="mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.text }}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    aria-invalid={errors.password ? 'true' : 'false'}
                    aria-describedby={
                      errors.password ? 'password-error' : undefined
                    }
                    className="w-full rounded-lg border px-3 py-2 pr-10 text-sm outline-none transition shadow-sm"
                    style={{
                      borderColor: errors.password
                        ? theme.error
                        : 'rgba(17,24,39,0.15)',
                      boxShadow:
                        '0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)',
                    }}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={validate}
                    required
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPassword((s) => !s);
                    }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-2 flex items-center px-2 rounded-md focus:outline-none"
                    style={{
                      color: '#6B7280',
                      backgroundColor: 'transparent',
                    }}
                  >
                    {showPassword ? (
                      <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 5c-7 0-10 7-10 7s1.6 3.3 4.7 5.2L3 21l1.4 1.4 18-18L21 3l-2.8 2.8C15.9 4.7 13.9 5 12 5zm0 4a3 3 0 012.8 4l-3.8 3.8A3 3 0 0112 9zm0 8c7 0 10-7 10-7s-.9-1.9-2.8-3.6l-1.4 1.4C19.3 9.9 20 12 20 12s-3 6-8 6c-1 0-2-.2-2.9-.6l-1.5 1.5C9 19.4 10.5 20 12 20z" />
                      </svg>
                    ) : (
                      <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 110-10 5 5 0 010 10z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password ? (
                  <p
                    id="password-error"
                    className="mt-1 text-xs"
                    style={{ color: theme.error }}
                    role="alert"
                  >
                    {errors.password}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center justify-between mb-5">
                <div />
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium hover:underline focus:underline"
                  style={{ color: theme.primary }}
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg px-4 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  backgroundColor: submitting ? '#93C5FD' : theme.primary,
                  color: 'white',
                  boxShadow:
                    '0 10px 15px -3px rgba(37,99,235,0.25), 0 4px 6px -4px rgba(37,99,235,0.25)',
                }}
                disabled={submitting}
                aria-busy={submitting ? 'true' : 'false'}
              >
                {submitting ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            <div className="my-6">
              <div className="relative flex items-center">
                <div className="flex-grow border-t" style={{ borderColor: 'rgba(17,24,39,0.08)' }} />
                <span className="mx-3 text-xs text-gray-500">or continue with</span>
                <div className="flex-grow border-t" style={{ borderColor: 'rgba(17,24,39,0.08)' }} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="w-full rounded-lg border px-3 py-2 text-sm text-gray-500"
                  style={{ borderColor: 'rgba(17,24,39,0.15)', backgroundColor: '#F9FAFB' }}
                  title="Coming soon"
                >
                  Google
                </button>
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="w-full rounded-lg border px-3 py-2 text-sm text-gray-500"
                  style={{ borderColor: 'rgba(17,24,39,0.15)', backgroundColor: '#F9FAFB' }}
                  title="Coming soon"
                >
                  Facebook
                </button>
              </div>
            </div>
          </div>

          <div
            className="px-6 sm:px-8 py-4 rounded-b-2xl"
            style={{
              background:
                'linear-gradient(180deg, rgba(245,247,250,1) 0%, rgba(255,255,255,1) 100%)',
              borderTop: '1px solid rgba(17,24,39,0.06)',
            }}
          >
            <p className="text-sm text-gray-700 text-center">
              New to the platform?{' '}
              <Link
                to="/get-started"
                className="font-medium hover:underline focus:underline"
                style={{ color: theme.secondary }}
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
