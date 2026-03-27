'use client';

import { useQuery } from '@tanstack/react-query';
import { feedingService } from '../services/feedingService';

interface UseFeedingsParams {
  page?: number;
  limit?: number;
  search?: string;
  enabled?: boolean;
}

export function useFeedings({
  page = 1,
  limit = 25,
  search,
  enabled = true,
}: UseFeedingsParams = {}) {
  return useQuery({
    queryKey: ['feedings', 'list', page, limit, search],
    queryFn: () => feedingService.list({ page, limit, search }),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}
