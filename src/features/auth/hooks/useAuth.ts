"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "../api";
import { useLogin } from "./useLogin";

/**
 * Hook principal de autenticação
 * Gerencia o estado de autenticação e fornece métodos para login/logout
 */
export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const loginHook = useLogin();

  // Query para verificar o estado de autenticação
  const { data: authState, isLoading } = useQuery({
    queryKey: ["auth", "check"],
    queryFn: async () => {
      const result = await authService.checkAuth();
      return result;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: false,
  });

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      // Limpa o cache do React Query
      queryClient.clear();
      router.push("/login");
      router.refresh();
    }
  };

  return {
    // Estado de autenticação
    isAuthenticated: authState?.isAuthenticated ?? false,
    isLoading: isLoading || loginHook.isLoading,
    
    // Métodos de autenticação
    login: loginHook.login,
    loginAsync: loginHook.loginAsync,
    logout,
    
    // Estado do login
    loginError: loginHook.error,
    isLoginError: loginHook.isError,
    resetLoginError: loginHook.reset,
  };
}

