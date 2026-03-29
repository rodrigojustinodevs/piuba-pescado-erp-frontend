'use client';

import { useQuery } from '@tanstack/react-query';
import { waterQualityService } from '../services/waterQualityService';

interface UseWaterQualitiesParams {
  page?: number;
  limit?: number;
  search?: string;
  enabled?: boolean;
}

export function useWaterQualities({
  page = 1,
  limit = 25,
  search,
  enabled = true,
}: UseWaterQualitiesParams = {}) {
  return useQuery({
    queryKey: ['waterQualities', 'list', page, limit, search],
    queryFn: () => waterQualityService.list({ page, limit, search }),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}
