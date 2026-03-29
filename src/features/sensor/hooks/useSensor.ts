'use client';

import { useQuery } from '@tanstack/react-query';
import { sensorService } from '../services/sensorService';

export function useSensor(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['sensors', 'detail', id],
    queryFn: () => {
      if (!id) throw new Error('ID é obrigatório');
      return sensorService.getById(id);
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5,
  });
}
