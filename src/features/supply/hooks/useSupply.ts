'use client';

import { useQuery } from '@tanstack/react-query';
import { supplyService } from '../services/supplyService';

export function useSupply(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['supplies', 'detail', id],
    queryFn: () => {
      if (!id) throw new Error('ID é obrigatório');
      return supplyService.getById(id);
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5,
  });
}

