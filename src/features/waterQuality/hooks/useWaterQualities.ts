'use client';

import { REALTIME_STALE_TIME } from '@/shared/lib/react-query-client';
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
    staleTime: REALTIME_STALE_TIME,
  });
}
