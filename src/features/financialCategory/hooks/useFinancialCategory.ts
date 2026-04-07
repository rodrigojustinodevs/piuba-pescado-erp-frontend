'use client';

import { useQuery } from '@tanstack/react-query';
import { financialCategoryService } from '../services/financialCategoryService';

export function useFinancialCategory(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['financial-categories', 'detail', id],
    queryFn: () => {
      if (!id) throw new Error('ID é obrigatório');
      return financialCategoryService.getById(id);
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5,
  });
}
