'use client';

import { useQuery } from '@tanstack/react-query';
import { biometryService } from '../services/biometryService';

/**
 * Hook para buscar uma biometria por ID
 */
export function useBiometry(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['biometries', 'detail', id],
    queryFn: () => {
      if (!id) throw new Error('ID é obrigatório');
      return biometryService.getById(id);
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
