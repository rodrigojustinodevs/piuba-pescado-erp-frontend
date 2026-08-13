'use client';

import { useQuery } from '@tanstack/react-query';
import { speciesService } from '../services/speciesService';

/**
 * Hook para buscar uma espécie por ID
 */
export function useSpecies(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['species', 'detail', id],
    queryFn: () => {
      if (!id) throw new Error('ID é obrigatório');
      return speciesService.getById(id);
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5,
  });
}
