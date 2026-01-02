"use client";

import { useQuery } from "@tanstack/react-query";
import { tankService } from "../services/tankService";

interface UseTanksParams {
  page?: number;
  limit?: number;
  search?: string;
  enabled?: boolean;
}

/**
 * Hook para listar tanques com paginação
 */
export function useTanks({
  page = 1,
  limit = 10,
  search,
  enabled = true,
}: UseTanksParams = {}) {
  return useQuery({
    queryKey: ["tanks", "list", page, limit, search],
    queryFn: () => tankService.list({ page, limit, search }),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}


