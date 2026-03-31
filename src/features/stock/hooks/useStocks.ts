'use client';

import { useQuery } from '@tanstack/react-query';
import { stockService } from '../services/stockService';

interface UseStocksParams {
  page?: number;
  limit?: number;
  search?: string;
  enabled?: boolean;
}

export function useStocks({ page = 1, limit = 25, search, enabled = true }: UseStocksParams = {}) {
  return useQuery({
    queryKey: ['stocks', 'list', page, limit, search],
    queryFn: () => stockService.list({ page, limit, search }),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}
