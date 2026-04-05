import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type UserMode = 'passenger' | 'driver';

interface UserModeContextType {
  mode: UserMode;
  setMode: (mode: UserMode) => void;
  toggleMode: () => void;
  isDriver: boolean;
  isPassenger: boolean;
}

const UserModeContext = createContext<UserModeContextType | undefined>(undefined);

export function UserModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<UserMode>(() => {
    const stored = localStorage.getItem('rideflex-user-mode');
    return (stored === 'driver' ? 'driver' : 'passenger') as UserMode;
  });

  useEffect(() => {
    localStorage.setItem('rideflex-user-mode', mode);
  }, [mode]);

  const setMode = (m: UserMode) => setModeState(m);
  const toggleMode = () => setModeState(prev => prev === 'passenger' ? 'driver' : 'passenger');

  return (
    <UserModeContext.Provider value={{ mode, setMode, toggleMode, isDriver: mode === 'driver', isPassenger: mode === 'passenger' }}>
      {children}
    </UserModeContext.Provider>
  );
}

export function useUserMode() {
  const ctx = useContext(UserModeContext);
  if (!ctx) throw new Error('useUserMode must be used within UserModeProvider');
  return ctx;
}
