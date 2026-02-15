'use client';

import { useQuery } from '@tanstack/react-query';
import { tankService } from '../services/tankService';

/**
 * Hook para buscar um tanque por ID
 */
export function useTank(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['tanks', 'detail', id],
    queryFn: () => {
      if (!id) throw new Error('ID é obrigatório');
      return tankService.getById(id);
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
