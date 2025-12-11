"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/shared/contexts/ToastContext";
import { companyService } from "../services/companyService";
import type { UpdateCompanyData } from "../types";

/**
 * Hook para atualizar uma empresa existente
 */
export function useUpdateCompany() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: UpdateCompanyData) => companyService.update(data),
    onSuccess: (data) => {
      // Invalida queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["companies", "list"] });
      queryClient.invalidateQueries({ queryKey: ["companies", "detail", data.id] });
      
      // Mostra mensagem de sucesso
      showSuccess("Empresa atualizada com sucesso!");
      
      // Redireciona para a página de detalhes
      router.push(`/admin/companies/${data.id}`);
    },
    onError: (error: Error) => {
      showError(error.message || "Erro ao atualizar empresa. Tente novamente.");
    },
  });
}

