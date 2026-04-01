'use client';

import { useQuery } from '@tanstack/react-query';
import { clientService } from '../services/clientService';

export function useClient(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['clients', 'detail', id],
    queryFn: () => {
      if (!id) throw new Error('ID é obrigatório');
      return clientService.getById(id);
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5,
  });
}

