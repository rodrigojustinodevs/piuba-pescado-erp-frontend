"use client";

import { useQuery } from "@tanstack/react-query";
import { companyService } from "../services/companyService";

/**
 * Hook para buscar uma empresa por ID
 */
export function useCompany(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ["companies", "detail", id],
    queryFn: () => {
      if (!id) throw new Error("ID é obrigatório");
      return companyService.getById(id);
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

