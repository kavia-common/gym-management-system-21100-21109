/**
 * Authentication Context: provides user/session and listens for Supabase auth changes.
 * Defensively handles environments without Supabase env vars by operating in no-auth mode
 * and guards all uses of supabase.auth to avoid null dereference in unconfigured builds.
 */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase, getCurrentSession, __supabaseEnvPresence, __supabaseEnvSource } from '../lib/supabaseClient';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Auth context value shape with public interfaces.
 */
const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  // action setters
  setUser: () => {},
  setSession: () => {},
  // auth actions
  signIn: async (_payload) => ({ error: null }),
  signUp: async (_payload) => ({ error: null }),
  signOut: async () => ({ error: null }),
  resetPassword: async (_email) => ({ error: null }),
});

/**
 * Resolve app/site base URL for email redirect flows.
 */
function getSiteUrl() {
  // Prefer explicit env, fallback to window origin
  const envUrl =
    (typeof process !== 'undefined' && process.env && process.env.REACT_APP_SITE_URL) ||
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.REACT_APP_SITE_URL);
  try {
    return (envUrl || window.location.origin).replace(/\/$/, '');
  } catch {
    return window.location.origin;
  }
}

// PUBLIC_INTERFACE
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate?.() || (() => {});
  const location = useLocation?.() || { search: '' };

  // Initialize session on mount and subscribe to changes
  useEffect(() => {
    // Dev guard logs
    if (typeof window !== 'undefined' && (process.env.NODE_ENV !== 'production')) {
      // eslint-disable-next-line no-console
      console.info('[Auth] Supabase guard:', {
        hasClient: !!supabase,
        hasAuth: !!supabase?.auth,
        hasGetSession: typeof supabase?.auth?.getSession === 'function',
        envSource: __supabaseEnvSource,
        presence: __supabaseEnvPresence,
      });
    }

    let mounted = true;

    (async () => {
      try {
        const currentSession = await getCurrentSession();
        if (!mounted) return;
        setSession(currentSession || null);
        setUser(currentSession?.user || null);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[Auth] Failed to get current session', e?.message || e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    // Subscribe to auth state changes if client available
    const canSubscribe =
      !!supabase &&
      !!supabase.auth &&
      typeof supabase.auth.onAuthStateChange === 'function';

    let unsubscribe = null;

    if (canSubscribe) {
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user || null);
      });
      unsubscribe =
        authListener?.subscription?.unsubscribe?.bind(authListener?.subscription) || null;
    }

    return () => {
      mounted = false;
      if (typeof unsubscribe === 'function') {
        try {
          unsubscribe();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Handle password recovery redirect (type=recovery) -> show reset page
  useEffect(() => {
    try {
      const params = new URLSearchParams(location?.search || window.location.search);
      const type = params.get('type');
      if (type === 'recovery') {
        // Navigate to reset page so user can set a new password
        navigate('/reset-password', { replace: true });
      }
    } catch {
      // ignore URL parsing errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.search]);

  // PUBLIC_INTERFACE
  async function signIn({ email, password }) {
    /**
     * Sign in with email/password using Supabase.
     * Returns { error: string | null }
     */
    if (!supabase?.auth?.signInWithPassword) {
      return { error: 'Authentication is not configured. Please contact support.' };
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message || 'Unable to sign in.' };
      setSession(data?.session || null);
      setUser(data?.user || data?.session?.user || null);
      return { error: null };
    } catch (e) {
      return { error: e?.message || 'Unexpected error during sign in.' };
    }
  }

  // PUBLIC_INTERFACE
  async function signUp({ email, password, metadata }) {
    /**
     * Sign up with email/password. Sends verification email with redirect.
     * Returns { error: string | null }
     */
    if (!supabase?.auth?.signUp) {
      return { error: 'Authentication is not configured. Please contact support.' };
    }
    const emailRedirectTo = `${getSiteUrl()}/auth/callback`;
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo,
          data: metadata || {},
        },
      });
      if (error) return { error: error.message || 'Unable to sign up.' };
      // Do not auto-auth if email confirmation required
      setSession(data?.session || null);
      setUser(data?.user || data?.session?.user || null);
      return { error: null };
    } catch (e) {
      return { error: e?.message || 'Unexpected error during sign up.' };
    }
  }

  // PUBLIC_INTERFACE
  async function signOut() {
    /**
     * Signs out the current user.
     */
    if (!supabase?.auth?.signOut) {
      // Even without client, clear local state
      setUser(null);
      setSession(null);
      return { error: null };
    }
    try {
      const { error } = await supabase.auth.signOut();
      if (error) return { error: error.message || 'Unable to sign out.' };
      setUser(null);
      setSession(null);
      return { error: null };
    } catch (e) {
      return { error: e?.message || 'Unexpected error during sign out.' };
    }
  }

  // PUBLIC_INTERFACE
  async function resetPassword(email) {
    /**
     * Initiates a password reset email flow.
     */
    if (!supabase?.auth?.resetPasswordForEmail) {
      return { error: 'Authentication is not configured. Please contact support.' };
    }
    const redirectTo = `${getSiteUrl()}/reset-password?from=recovery`;
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      if (error) return { error: error.message || 'Unable to send reset email.' };
      return { error: null };
    } catch (e) {
      return { error: e?.message || 'Unexpected error during password reset.' };
    }
  }

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      setUser,
      setSession,
      signIn,
      signUp,
      signOut,
      resetPassword,
    }),
    [user, session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
