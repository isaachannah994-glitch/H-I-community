'use client';

import { useEffect, useState, useContext, createContext, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { loginUser, logoutUser, registerMasterAdmin } from '@/lib/auth-service';
import { User } from '@/lib/types';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, displayName: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Solo escucha cambios de autenticación sin cargar datos adicionales
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setFirebaseUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      setError(null);
      const result = await loginUser(email, password);
      if (result.success && result.user) {
        setFirebaseUser(result.user);
        return { success: true };
      }
      const errorMsg = result.error || 'Error en inicio de sesión';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } catch (err: any) {
      const message = err.message || 'Error desconocido';
      setError(message);
      return { success: false, error: message };
    }
  };

  const handleLogout = async () => {
    try {
      const result = await logoutUser();
      if (result.success) {
        setFirebaseUser(null);
        setUserData(null);
      }
      return result;
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const handleRegister = async (email: string, password: string, displayName: string) => {
    try {
      setError(null);
      const result = await registerMasterAdmin(email, password, displayName);
      if (result.success && result.user) {
        setFirebaseUser(result.user);
        return { success: true };
      }
      const errorMsg = result.error || 'Error en registro';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } catch (err: any) {
      const message = err.message || 'Error desconocido';
      setError(message);
      return { success: false, error: message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        userData,
        loading,
        error,
        login: handleLogin,
        logout: handleLogout,
        register: handleRegister,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
