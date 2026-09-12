import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '../types';
import { loginApi, getMeApi } from '../api/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(() => {
    const cached = localStorage.getItem('user');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const login = async (email: string, password: string) => {
    const authData = await loginApi({ email, password });
    localStorage.setItem('token', authData.access_token);
    setToken(authData.access_token);

    // Fetch user profile immediately after login
    try {
      const userData = await getMeApi();
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch {
      // Fallback if /me fails
      const fallbackUser: User = { email, full_name: 'Trial Researcher' };
      setUser(fallbackUser);
    }
  };

  useEffect(() => {
    let mounted = true;

    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        if (mounted) {
          setIsLoading(false);
        }
        return;
      }

      try {
        const userData = await getMeApi();
        if (mounted) {
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } catch {
        if (mounted) {
          logout();
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    verifyAuth();

    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => {
      mounted = false;
      window.removeEventListener('auth-unauthorized', handleUnauthorized);
    };
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
