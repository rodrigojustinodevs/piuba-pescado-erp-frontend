'use client';

import { useQuery } from '@tanstack/react-query';
import { purchaseService } from '../services/purchaseService';

export function usePurchase(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['purchases', 'detail', id],
    queryFn: () => {
      if (!id) throw new Error('ID é obrigatório');
      return purchaseService.getById(id);
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5,
  });
}
