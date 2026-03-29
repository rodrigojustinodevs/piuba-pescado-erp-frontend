'use client';

import { useQuery } from '@tanstack/react-query';
import { sensorService } from '../services/sensorService';

interface UseSensorsParams {
  page?: number;
  limit?: number;
  search?: string;
  enabled?: boolean;
}

export function useSensors({ page = 1, limit = 25, search, enabled = true }: UseSensorsParams = {}) {
  return useQuery({
    queryKey: ['sensors', 'list', page, limit, search],
    queryFn: () => sensorService.list({ page, limit, search }),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}
