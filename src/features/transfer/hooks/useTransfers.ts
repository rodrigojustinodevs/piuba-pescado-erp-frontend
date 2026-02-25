'use client';

import { useQuery } from '@tanstack/react-query';
import { transferService } from '../services/transferService';

interface UseTransfersParams {
  page?: number;
  per_page?: number;
  enabled?: boolean;
}

export function useTransfers({ page = 1, per_page = 25, enabled = true }: UseTransfersParams = {}) {
  return useQuery({
    queryKey: ['transfers', 'list', page, per_page],
    queryFn: () => transferService.list({ page, per_page }),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
