/**
 * Authentication Context: provides user/session and listens for Supabase auth changes.
 * Defensively handles environments without Supabase env vars by operating in no-auth mode
 * and guards all uses of supabase.auth to avoid null dereference in unconfigured builds.
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getCurrentSession } from '../lib/supabaseClient';

const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  setUser: () => {},
  setSession: () => {},
});

// PUBLIC_INTERFACE
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const currentSession = await getCurrentSession();
        if (!mounted) return;
        setSession(currentSession || null);
        setUser(currentSession?.user || null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    // Only subscribe when a real Supabase client is present
    const canSubscribe =
      supabase &&
      !supabase.__noop &&
      supabase.auth &&
      typeof supabase.auth.onAuthStateChange === 'function';

    let unsubscribe = null;

    if (canSubscribe) {
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user || null);
      });
      unsubscribe = authListener?.subscription?.unsubscribe?.bind(authListener?.subscription) || null;
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

  const value = {
    user,
    session,
    loading,
    setUser,
    setSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
