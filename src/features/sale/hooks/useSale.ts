'use client';

import { useQuery } from '@tanstack/react-query';
import { saleService } from '../services/saleService';

export function useSale(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['sales', 'detail', id],
    queryFn: () => {
      if (!id) throw new Error('ID é obrigatório');
      return saleService.getById(id);
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5,
  });
}
