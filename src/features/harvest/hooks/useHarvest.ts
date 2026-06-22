'use client';

import { useQuery } from '@tanstack/react-query';
import { harvestService } from '../services/harvestService';

export function useHarvest(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['harvests', 'detail', id],
    queryFn: () => {
      if (!id) throw new Error('ID é obrigatório');
      return harvestService.getById(id);
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5,
  });
}
