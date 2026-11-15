'use client';

import { REALTIME_STALE_TIME } from '@/shared/lib/react-query-client';
import { useQuery } from '@tanstack/react-query';
import { sensorReadingService } from '../services/sensorReadingService';

export function useSensorReading(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['sensorReadings', 'detail', id],
    queryFn: () => {
      if (!id) throw new Error('ID é obrigatório');
      return sensorReadingService.getById(id);
    },
    enabled: enabled && !!id,
    staleTime: REALTIME_STALE_TIME,
  });
}
