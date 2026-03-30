'use client';

import { useQuery } from '@tanstack/react-query';
import { supplierService } from '../services/supplierService';

export function useSupplier(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['suppliers', 'detail', id],
    queryFn: () => {
      if (!id) throw new Error('ID é obrigatório');
      return supplierService.getById(id);
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5,
  });
}
