'use client';

import { useQuery } from '@tanstack/react-query';
import { mortalityService } from '../services/mortalityService';

interface UseMortalitiesParams {
  page?: number;
  limit?: number;
  search?: string;
  enabled?: boolean;
}

export function useMortalities({
  page = 1,
  limit = 25,
  search,
  enabled = true,
}: UseMortalitiesParams = {}) {
  return useQuery({
    queryKey: ['mortalities', 'list', page, limit, search],
    queryFn: () => mortalityService.list({ page, limit, search }),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}
