import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * AuthContextValue provides auth state and actions.
 */
const AuthContext = createContext(undefined);

/**
 * PUBLIC_INTERFACE
 * useAuth returns the current auth context value.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

/**
 * PUBLIC_INTERFACE
 * AuthProvider wraps the app and manages Supabase session state.
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Bootstrap session and subscribe to changes
  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          // eslint-disable-next-line no-console
          console.error('Auth getSession error', error);
        }
        if (!mounted) return;
        const s = data?.session || null;
        setSession(s);
        setUser(s?.user || null);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Auth init unexpected error', e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s || null);
      setUser(s?.user || null);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // Actions
  // PUBLIC_INTERFACE
  const signUp = async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${(import.meta?.env?.VITE_SITE_URL) || window.location.origin}/auth/callback`,
        },
      });
      if (error) return { error: error.message };
      return { data };
    } catch (e) {
      return { error: e?.message || 'Sign up failed' };
    }
  };

  // PUBLIC_INTERFACE
  const signIn = async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      return { data };
    } catch (e) {
      return { error: e?.message || 'Sign in failed' };
    }
  };

  // PUBLIC_INTERFACE
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) return { error: error.message };
      return {};
    } catch (e) {
      return { error: e?.message || 'Sign out failed' };
    }
  };

  // PUBLIC_INTERFACE
  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${(import.meta?.env?.VITE_SITE_URL) || window.location.origin}/reset-password`,
      });
      if (error) return { error: error.message };
      return {};
    } catch (e) {
      return { error: e?.message || 'Reset request failed' };
    }
  };

  // PUBLIC_INTERFACE
  const updatePassword = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) return { error: error.message };
      return {};
    } catch (e) {
      return { error: e?.message || 'Update password failed' };
    }
  };

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      resetPassword,
      updatePassword,
    }),
    [user, session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
