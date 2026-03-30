'use client';

import { useQuery } from '@tanstack/react-query';
import { purchaseService } from '../services/purchaseService';

interface UsePurchasesParams {
  page?: number;
  limit?: number;
  search?: string;
  enabled?: boolean;
}

export function usePurchases({
  page = 1,
  limit = 25,
  search,
  enabled = true,
}: UsePurchasesParams = {}) {
  return useQuery({
    queryKey: ['purchases', 'list', page, limit, search],
    queryFn: () => purchaseService.list({ page, limit, search }),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}
