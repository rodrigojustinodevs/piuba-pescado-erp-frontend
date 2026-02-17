'use client';

import { useQuery } from '@tanstack/react-query';
import { settlementService } from '../services/settlementService';

interface UseSettlementsParams {
  page?: number;
  per_page?: number;
  enabled?: boolean;
}

export function useSettlements({
  page = 1,
  per_page = 25,
  enabled = true,
}: UseSettlementsParams = {}) {
  return useQuery({
    queryKey: ['settlements', 'list', page, per_page],
    queryFn: () => settlementService.list({ page, per_page }),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
