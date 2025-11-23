"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "../api";
import type { LoginCredentials, LoginResponse } from "../types";

/**
 * Hook para realizar login usando React Query
 */
export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<LoginResponse> => {
      const response = await authService.login(credentials);
      
      if (!response.ok) {
        throw new Error(response.message || "Credenciais inválidas");
      }

      // Retorna a resposta com o token
      return response;
    },
    onSuccess: () => {
      // Invalida queries relacionadas à autenticação
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      
      // Redireciona para o dashboard após login bem-sucedido
      router.push("/dashboard");
      router.refresh(); // Força atualização do middleware
    },
    onError: (error: Error) => {
      // Erro já é tratado pelo mutation.error
      console.error("Erro ao fazer login:", error);
    },
  });

  return {
    login: mutation.mutate,
    loginAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isError: mutation.isError,
    reset: mutation.reset,
  };
}




