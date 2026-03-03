'use client';

import { useQuery } from '@tanstack/react-query';
import { stockingService } from '../services/stockingService';

export function useStocking(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['stockings', 'detail', id],
    queryFn: () => {
      if (!id) throw new Error('ID é obrigatório');
      return stockingService.getById(id);
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5,
  });
}
