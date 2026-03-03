'use client';

import { useQuery } from '@tanstack/react-query';
import { stockingService } from '../services/stockingService';

interface UseStockingsParams {
  page?: number;
  per_page?: number;
  enabled?: boolean;
}

export function useStockings({ page = 1, per_page = 25, enabled = true }: UseStockingsParams = {}) {
  return useQuery({
    queryKey: ['stockings', 'list', page, per_page],
    queryFn: () => stockingService.list({ page, per_page }),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
