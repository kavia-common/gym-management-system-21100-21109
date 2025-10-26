import React, { createContext, useContext, useEffect, useState } from 'react';
import supabase, { getCurrentSession } from '../lib/supabaseClient';

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

    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user || null);
    });

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe?.();
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
