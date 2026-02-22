'use client';

import { useQuery } from '@tanstack/react-query';
import { tankService } from '../services/tankService';

interface UseTanksWithoutBatchesParams {
  page?: number;
  per_page?: number;
  enabled?: boolean;
}

/**
 * Hook para listar tanques sem lotes (disponíveis para destino).
 */
export function useTanksWithoutBatches({
  page = 1,
  per_page = 15,
  enabled = true,
}: UseTanksWithoutBatchesParams = {}) {
  return useQuery({
    queryKey: ['tanks', 'without-batches', page, per_page],
    queryFn: () => tankService.listWithoutBatches({ page, per_page }),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}
