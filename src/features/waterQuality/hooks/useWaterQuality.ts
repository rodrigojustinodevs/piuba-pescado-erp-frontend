'use client';

import { useQuery } from '@tanstack/react-query';
import { waterQualityService } from '../services/waterQualityService';

export function useWaterQuality(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['waterQualities', 'detail', id],
    queryFn: () => {
      if (!id) throw new Error('ID é obrigatório');
      return waterQualityService.getById(id);
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5,
  });
}
