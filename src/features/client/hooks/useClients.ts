'use client';

import { useQuery } from '@tanstack/react-query';
import { clientService } from '../services/clientService';

export function useClients(params: { page: number; limit: number; search?: string }) {
  return useQuery({
    queryKey: ['clients', 'list', params.page, params.limit, params.search],
    queryFn: () => clientService.list(params),
    staleTime: 1000 * 60 * 5,
  });
}

