"use client";

import { useQuery } from "@tanstack/react-query";
import { batchService } from "../services/batchService";

export interface UseBatchesParams {
  page?: number;
  limit?: number;
  search?: string;
  enabled?: boolean;
}

/**
 * Hook para listar lotes (batches).
 * Controla loading, error e data; preparado para paginação e busca.
 */
export function useBatches({
  page = 1,
  limit = 10,
  search,
  enabled = true,
}: UseBatchesParams = {}) {
  const query = useQuery({
    queryKey: ["batches", "list", page, limit, search],
    queryFn: () => batchService.getBatches({ page, limit, search }),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
  
  return {
    data: query.data,
    batches: query.data?.batches ?? [],
    pagination: query.data
      ? {
          total: query.data.total,
          page: query.data.page,
          limit: query.data.limit,
        }
      : undefined,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    isError: query.isError,
    refetch: query.refetch,
  };
}
