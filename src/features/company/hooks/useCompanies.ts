"use client";

import { useQuery } from "@tanstack/react-query";
import { companyService } from "../services/companyService";

interface UseCompaniesParams {
  page?: number;
  limit?: number;
  search?: string;
  enabled?: boolean;
}

/**
 * Hook para listar empresas com paginação
 */
export function useCompanies({
  page = 1,
  limit = 10,
  search,
  enabled = true,
}: UseCompaniesParams = {}) {
  return useQuery({
    queryKey: ["companies", "list", page, limit, search],
    queryFn: () => companyService.list({ page, limit, search }),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

