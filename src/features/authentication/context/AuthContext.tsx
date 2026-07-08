import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as authApi from '../services/authApi';
import { type CurrentUser, type LoginRequest, type RegisterRequest } from '../types/authTypes';
import {
  clearStoredUser,
  clearToken,
  getStoredUser,
  getToken,
  setStoredUser,
  setToken,
} from '../../../shared/utils/tokenStorage';

type AuthContextValue = {
  user: CurrentUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (request: LoginRequest) => Promise<CurrentUser>;
  register: (request: RegisterRequest) => Promise<void>;
  refreshCurrentUser: () => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setTokenState] = useState<string | null>(() => getToken());
  const [user, setUser] = useState<CurrentUser | null>(() => getStoredUser());
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(getToken()));

  const logout = useCallback(() => {
    clearToken();
    clearStoredUser();
    setTokenState(null);
    setUser(null);
  }, []);

  const refreshCurrentUser = useCallback(async () => {
    if (!getToken()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.getCurrentUser();

      if (response.success && response.data) {
        setUser(response.data);
        setStoredUser(response.data);
      }
    } catch {
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    void refreshCurrentUser();
  }, [refreshCurrentUser]);

  const login = useCallback(async (request: LoginRequest) => {
    const response = await authApi.login(request);

    if (!response.data) {
      throw new Error(response.message);
    }

    setToken(response.data.token);
    setStoredUser(response.data.user);
    setTokenState(response.data.token);
    setUser(response.data.user);

    return response.data.user;
  }, []);

  const register = useCallback(async (request: RegisterRequest) => {
    await authApi.register(request);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isLoading,
      login,
      register,
      refreshCurrentUser,
      logout,
    }),
    [isLoading, login, logout, refreshCurrentUser, register, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
