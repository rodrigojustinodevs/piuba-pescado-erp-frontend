'use client';

import { useQuery } from '@tanstack/react-query';
import type { SupplyListResponse } from '@/features/supply/types';
import { feedingLookupService } from '../services/feedingLookupService';

export function useFeedingStocks(enabled = true, companyId?: string | null) {
  const cid = companyId?.trim() || null;
  return useQuery<SupplyListResponse>({
    queryKey: ['feedingLookups', 'stocks', cid],
    queryFn: () => feedingLookupService.listStocks(cid),
    enabled,
    staleTime: 1000 * 60 * 10,
  });
}
