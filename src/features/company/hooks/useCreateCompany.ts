"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/shared/contexts/ToastContext";
import { companyService } from "../services/companyService";
import type { CreateCompanyData } from "../types";

/**
 * Hook para criar uma nova empresa
 */
export function useCreateCompany() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: CreateCompanyData) => companyService.create(data),
    onSuccess: (data) => {
      // Invalida a lista de empresas
      queryClient.invalidateQueries({ queryKey: ["companies", "list"] });
      
      // Mostra mensagem de sucesso
      showSuccess("Empresa criada com sucesso!");
      
      // Redireciona para a página de detalhes
      router.push(`/admin/companies/${data.id}`);
    },
    onError: (error: Error) => {
      showError(error.message || "Erro ao criar empresa. Tente novamente.");
    },
  });
}

