'use client';

import { createContext, useContext, useMemo, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from '@/features/auth/api';
import { useLogin } from '@/features/auth/hooks/useLogin';
import type { LoginCredentials, LoginResponse } from '@/features/auth/types';
import { UserRole, type UserRoleType, type AuthenticatedUser } from '@/shared/types/auth';

type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthenticatedUser | null;
  login: (credentials: LoginCredentials) => void;
  loginAsync: (credentials: LoginCredentials) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  hasRole: (role: UserRoleType | UserRoleType[]) => boolean;
  canAccess: (allowedRoles: UserRoleType[]) => boolean;
  isMaster: () => boolean;
  isCompanyAdmin: () => boolean;
  hasCompany: () => boolean;
  loginError: Error | null;
  isLoginError: boolean;
  resetLoginError: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const loginHook = useLogin();

  const { data: authState, isLoading } = useQuery({
    queryKey: ['auth', 'check'],
    queryFn: () => authService.checkAuth(),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      queryClient.clear();
      router.push('/login');
      router.refresh();
    }
  }, [queryClient, router]);

  const hasRole = useMemo(
    () =>
      (role: UserRoleType | UserRoleType[]): boolean => {
        if (!authState?.user?.role) return false;
        const userRole = authState.user.role;
        return Array.isArray(role) ? role.includes(userRole) : userRole === role;
      },
    [authState?.user],
  );

  const canAccess = useMemo(
    () =>
      (allowedRoles: UserRoleType[]): boolean => {
        if (!authState?.user?.role) return false;
        return allowedRoles.includes(authState.user.role);
      },
    [authState?.user],
  );

  const isMaster = useMemo(
    () => (): boolean => authState?.user?.role === UserRole.MASTER,
    [authState?.user],
  );

  const isCompanyAdmin = useMemo(
    () => (): boolean => authState?.user?.role === UserRole.COMPANY_ADMIN,
    [authState?.user],
  );

  const hasCompany = useMemo(() => (): boolean => !!authState?.user?.companyId, [authState?.user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: authState?.isAuthenticated ?? false,
      isLoading: isLoading || loginHook.isLoading,
      user: authState?.user ?? null,
      login: loginHook.login,
      loginAsync: loginHook.loginAsync,
      logout,
      hasRole,
      canAccess,
      isMaster,
      isCompanyAdmin,
      hasCompany,
      loginError: loginHook.error,
      isLoginError: loginHook.isError,
      resetLoginError: loginHook.reset,
    }),
    [
      authState,
      isLoading,
      loginHook.login,
      loginHook.loginAsync,
      loginHook.isLoading,
      loginHook.error,
      loginHook.isError,
      loginHook.reset,
      logout,
      hasRole,
      canAccess,
      isMaster,
      isCompanyAdmin,
      hasCompany,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}
