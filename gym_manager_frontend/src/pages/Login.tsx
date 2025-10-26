import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * Login page with Ocean Professional styling.
 * Features:
 * - Centered responsive card layout
 * - Email and password fields with validation
 * - Remember me checkbox
 * - Forgot password link routing to /reset-password
 * - Loading state on submit
 * - Keyboard and screen-reader accessible
 * - Error and helper text display
 * - Matches header styling (colors, spacing, focus rings)
 * - Subtle background gradient
 * - Footer links to Sign up and Get Started
 */
export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation() as any;
  const from = location.state?.from?.pathname || '/dashboard';

  // Email validation
  const validateEmail = (value: string): boolean => {
    if (!value.trim()) {
      setEmailError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  // Password validation
  const validatePassword = (value: string): boolean => {
    if (!value) {
      setPasswordError('Password is required');
      return false;
    }
    if (value.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  // Handle email blur
  const handleEmailBlur = () => {
    if (email) {
      validateEmail(email);
    }
  };

  // Handle password blur
  const handlePasswordBlur = () => {
    if (password) {
      validatePassword(password);
    }
  };

  // Handle form submission
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    setSuccessMessage('');

    // Validate all fields
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await signIn({ email, password });
      
      if (error) {
        setGeneralError(error);
        setSubmitting(false);
      } else {
        setSuccessMessage('Logged in successfully. Redirecting...');
        // Store remember me preference (could be used for future enhancements)
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberMe');
        }
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 600);
      }
    } catch (err) {
      setGeneralError('An unexpected error occurred. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'linear-gradient(180deg, rgba(37, 99, 235, 0.08) 0%, #f9fafb 100%)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
          padding: '40px 32px',
          border: '1px solid rgba(229, 231, 235, 0.8)',
        }}
      >
        {/* Logo and Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              fontSize: '3rem',
              marginBottom: '12px',
            }}
            aria-hidden="true"
          >
            💪
          </div>
          <h1
            style={{
              margin: '0 0 8px 0',
              fontSize: '1.75rem',
              fontWeight: 700,
              color: '#111827',
            }}
          >
            Welcome Back
          </h1>
          <p
            style={{
              margin: 0,
              color: '#6B7280',
              fontSize: '0.95rem',
            }}
          >
            Sign in to access your gym dashboard
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div
            role="alert"
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              color: '#065f46',
              background: '#d1fae5',
              border: '1px solid #a7f3d0',
              fontSize: '0.9rem',
            }}
          >
            {successMessage}
          </div>
        )}

        {/* General Error Message */}
        {generalError && (
          <div
            role="alert"
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              color: '#991b1b',
              background: '#fee2e2',
              border: '1px solid #fecaca',
              fontSize: '0.9rem',
            }}
          >
            {generalError}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={onSubmit} noValidate>
          {/* Email Field */}
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: '#374151',
              }}
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
              onBlur={handleEmailBlur}
              disabled={submitting}
              placeholder="you@example.com"
              aria-required="true"
              aria-invalid={!!emailError}
              aria-describedby={emailError ? 'email-error' : undefined}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: `1px solid ${emailError ? '#EF4444' : '#E5E7EB'}`,
                outline: 'none',
                fontSize: '1rem',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                backgroundColor: submitting ? '#F9FAFB' : '#ffffff',
              }}
              onFocus={(e) => {
                if (!emailError) {
                  e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.55)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.2)';
                }
              }}
              onBlur={(e) => {
                handleEmailBlur();
                e.currentTarget.style.borderColor = emailError ? '#EF4444' : '#E5E7EB';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            {emailError && (
              <p
                id="email-error"
                role="alert"
                style={{
                  margin: '6px 0 0 0',
                  color: '#EF4444',
                  fontSize: '0.85rem',
                }}
              >
                {emailError}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: '#374151',
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError('');
              }}
              onBlur={handlePasswordBlur}
              disabled={submitting}
              placeholder="Enter your password"
              aria-required="true"
              aria-invalid={!!passwordError}
              aria-describedby={passwordError ? 'password-error' : undefined}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: `1px solid ${passwordError ? '#EF4444' : '#E5E7EB'}`,
                outline: 'none',
                fontSize: '1rem',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                backgroundColor: submitting ? '#F9FAFB' : '#ffffff',
              }}
              onFocus={(e) => {
                if (!passwordError) {
                  e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.55)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.2)';
                }
              }}
              onBlur={(e) => {
                handlePasswordBlur();
                e.currentTarget.style.borderColor = passwordError ? '#EF4444' : '#E5E7EB';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            {passwordError && (
              <p
                id="password-error"
                role="alert"
                style={{
                  margin: '6px 0 0 0',
                  color: '#EF4444',
                  fontSize: '0.85rem',
                }}
              >
                {passwordError}
              </p>
            )}
          </div>

          {/* Remember Me and Forgot Password Row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            {/* Remember Me Checkbox */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                color: '#374151',
              }}
            >
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={submitting}
                style={{
                  width: '16px',
                  height: '16px',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  accentColor: '#2563EB',
                }}
                aria-label="Remember me on this device"
              />
              <span>Remember me</span>
            </label>

            {/* Forgot Password Link */}
            <Link
              to="/reset-password"
              style={{
                color: '#F59E0B',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 600,
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#D97706';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#F59E0B';
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = '2px solid #F59E0B';
                e.currentTarget.style.outlineOffset = '2px';
                e.currentTarget.style.borderRadius = '4px';
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = 'none';
              }}
              aria-label="Reset your password"
            >
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '14px 20px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: submitting ? '#93C5FD' : '#2563EB',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: submitting ? 'not-allowed' : 'pointer',
              boxShadow: submitting ? 'none' : '0 2px 6px rgba(37, 99, 235, 0.3)',
              transition: 'background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!submitting) {
                e.currentTarget.style.backgroundColor = '#1d4ed8';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!submitting) {
                e.currentTarget.style.backgroundColor = '#2563EB';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(37, 99, 235, 0.3)';
              }
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = '2px solid #F59E0B';
              e.currentTarget.style.outlineOffset = '2px';
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = 'none';
            }}
            aria-busy={submitting}
          >
            {submitting ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ animation: 'spin 1s linear infinite' }}
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                  <path d="M12 2 A10 10 0 0 1 22 12" strokeLinecap="round" />
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div
          style={{
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #E5E7EB',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              margin: '0 0 12px 0',
              color: '#6B7280',
              fontSize: '0.9rem',
            }}
          >
            Don't have an account?
          </p>
          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link
              to="/signup"
              style={{
                color: '#2563EB',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(37, 99, 235, 0.25)',
                transition: 'background-color 0.2s ease, border-color 0.2s ease',
                display: 'inline-block',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.25)';
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = '2px solid #2563EB';
                e.currentTarget.style.outlineOffset = '2px';
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = 'none';
              }}
              aria-label="Create a new account"
            >
              Sign Up
            </Link>
            <Link
              to="/get-started"
              style={{
                color: '#ffffff',
                background: '#F59E0B',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                padding: '8px 16px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(245, 158, 11, 0.2)',
                transition: 'background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease',
                display: 'inline-block',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#D97706';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(245, 158, 11, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F59E0B';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(245, 158, 11, 0.2)';
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = '2px solid #2563EB';
                e.currentTarget.style.outlineOffset = '2px';
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = 'none';
              }}
              aria-label="Get started with membership"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Loading Spinner Animation */}
      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
}
