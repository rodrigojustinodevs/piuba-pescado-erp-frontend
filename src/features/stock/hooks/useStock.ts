'use client';

import { useQuery } from '@tanstack/react-query';
import { stockService } from '../services/stockService';

export function useStock(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['stocks', 'detail', id],
    queryFn: () => {
      if (!id) throw new Error('ID é obrigatório');
      return stockService.getById(id);
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5,
  });
}
