'use client';

import { REALTIME_STALE_TIME } from '@/shared/lib/react-query-client';
import { useQuery } from '@tanstack/react-query';
import { sensorReadingService } from '../services/sensorReadingService';

interface UseSensorReadingsParams {
  page?: number;
  limit?: number;
  search?: string;
  enabled?: boolean;
}

export function useSensorReadings({
  page = 1,
  limit = 25,
  search,
  enabled = true,
}: UseSensorReadingsParams = {}) {
  return useQuery({
    queryKey: ['sensorReadings', 'list', page, limit, search],
    queryFn: () => sensorReadingService.list({ page, limit, search }),
    enabled,
    staleTime: REALTIME_STALE_TIME,
  });
}
