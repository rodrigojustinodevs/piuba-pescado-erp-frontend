"use client";

import { useQuery } from "@tanstack/react-query";
import { batchService } from "../services/batchService";

/**
 * Hook para buscar um lote por ID
 */
export function useBatch(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ["batches", "detail", id],
    queryFn: () => {
      if (!id) throw new Error("ID é obrigatório");
      return batchService.getById(id);
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
