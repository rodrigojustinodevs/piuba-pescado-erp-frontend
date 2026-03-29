'use client';

import { useQuery } from '@tanstack/react-query';
import { mortalityService } from '../services/mortalityService';

export function useMortality(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['mortalities', 'detail', id],
    queryFn: () => {
      if (!id) throw new Error('ID é obrigatório');
      return mortalityService.getById(id);
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5,
  });
}
