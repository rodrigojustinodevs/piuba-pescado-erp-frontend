'use client';

import { useQuery } from '@tanstack/react-query';
import { feedingService } from '../services/feedingService';

export function useFeeding(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['feedings', 'detail', id],
    queryFn: () => {
      if (!id) throw new Error('ID é obrigatório');
      return feedingService.getById(id);
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5,
  });
}
