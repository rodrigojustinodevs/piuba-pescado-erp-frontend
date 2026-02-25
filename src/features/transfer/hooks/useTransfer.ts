'use client';

import { useQuery } from '@tanstack/react-query';
import { transferService } from '../services/transferService';

export function useTransfer(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['transfers', 'detail', id],
    queryFn: () => {
      if (!id) throw new Error('ID é obrigatório');
      return transferService.getById(id);
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5,
  });
}
