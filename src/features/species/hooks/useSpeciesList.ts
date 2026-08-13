'use client';

import { useQuery } from '@tanstack/react-query';
import { speciesService } from '../services/speciesService';

interface UseSpeciesListParams {
  page?: number;
  limit?: number;
  search?: string;
  enabled?: boolean;
}

/**
 * Hook para listar espécies com paginação
 */
export function useSpeciesList({
  page = 1,
  limit = 10,
  search,
  enabled = true,
}: UseSpeciesListParams = {}) {
  return useQuery({
    queryKey: ['species', 'list', page, limit, search],
    queryFn: () => speciesService.list({ page, limit, search }),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}
