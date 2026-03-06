import { useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  nombre: string;
  rol: 'ADMIN' | 'GERENTE' | 'CAJERO' | 'VENDEDOR';
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simular verificación de autenticación
    const checkAuth = async () => {
      try {
        // TODO: Integrar con Firebase Auth
        const mockUser: User = {
          id: 'user-001',
          email: 'isaac03.24castillo@gmail.com',
          nombre: 'Isaac Castillo',
          rol: 'ADMIN',
        };
        setUser(mockUser);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error de autenticación');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = () => {
    setUser(null);
    // TODO: Implementar logout con Firebase
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    logout,
  };
};
