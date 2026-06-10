'use client';

import { useQuery } from '@tanstack/react-query';
import { harvestService } from '../services/harvestService';

interface UseHarvestsParams {
  page?: number;
  per_page?: number;
  enabled?: boolean;
}

export function useHarvests({ page = 1, per_page = 25, enabled = true }: UseHarvestsParams = {}) {
  return useQuery({
    queryKey: ['harvests', 'list', page, per_page],
    queryFn: () => harvestService.list({ page, per_page }),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}
