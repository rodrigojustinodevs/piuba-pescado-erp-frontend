'use client';

import { useQuery } from '@tanstack/react-query';
import { settlementService } from '../services/settlementService';

export function useSettlement(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['settlements', 'detail', id],
    queryFn: () => {
      if (!id) throw new Error('ID é obrigatório');
      return settlementService.getById(id);
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5,
  });
}
