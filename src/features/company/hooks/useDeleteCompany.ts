"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/shared/contexts/ToastContext";
import { companyService } from "../services/companyService";

/**
 * Hook para deletar uma empresa
 */
export function useDeleteCompany() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (id: string) => companyService.delete(id),
    onSuccess: () => {
      // Invalida a lista de empresas
      queryClient.invalidateQueries({ queryKey: ["companies", "list"] });
      
      // Mostra mensagem de sucesso
      showSuccess("Empresa excluída com sucesso!");
      
      // Redireciona para a lista
      router.push("/admin/companies");
    },
    onError: (error: Error) => {
      showError(error.message || "Erro ao excluir empresa. Tente novamente.");
    },
  });
}

