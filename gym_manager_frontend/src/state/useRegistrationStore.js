import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'registration.role';

/**
 * PUBLIC_INTERFACE
 * useRegistrationStore
 * A lightweight hook to manage and persist the user's selected registration role.
 * Syncs with localStorage key 'registration.role'.
 */
export function useRegistrationStore() {
  const [role, setRoleState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved || null;
    } catch {
      return null;
    }
  });

  const setRole = useCallback((nextRole) => {
    setRoleState(nextRole);
    try {
      if (nextRole) {
        localStorage.setItem(STORAGE_KEY, nextRole);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const clearRole = useCallback(() => {
    setRole(null);
  }, [setRole]);

  useEffect(() => {
    // Keep state in sync if other tabs change it
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) {
        setRoleState(e.newValue || null);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return { role, setRole, clearRole, STORAGE_KEY };
}

/**
 * PUBLIC_INTERFACE
 * getStoredRegistrationRole
 * Helper to read saved role without React.
 */
export function getStoredRegistrationRole() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
