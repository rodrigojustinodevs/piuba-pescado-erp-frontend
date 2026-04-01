'use client';

import { useQuery } from '@tanstack/react-query';
import type { StockListResponse } from '@/features/stock/types';
import { feedingLookupService } from '../services/feedingLookupService';

export function useFeedingStocks(enabled = true, companyId?: string | null) {
  const cid = companyId?.trim() || null;
  return useQuery<StockListResponse>({
    queryKey: ['feedingLookups', 'stocks', cid],
    queryFn: () => feedingLookupService.listStocks(cid),
    enabled,
    staleTime: 1000 * 60 * 10,
  });
}
