'use client';

import { useQuery } from '@tanstack/react-query';
import { supplyService } from '../services/supplyService';

export function useSupplies(params: { page: number; limit: number; search?: string }) {
  return useQuery({
    queryKey: ['supplies', 'list', params.page, params.limit, params.search],
    queryFn: () => supplyService.list(params),
    staleTime: 1000 * 60 * 5,
  });
}

