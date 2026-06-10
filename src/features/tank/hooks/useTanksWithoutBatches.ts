'use client';

import { useQuery } from '@tanstack/react-query';
import { tankService } from '../services/tankService';

interface UseTanksWithoutBatchesParams {
  page?: number;
  perPage?: number;
  companyId?: string;
  enabled?: boolean;
}

/**
 * Hook para listar tanques sem lotes (disponíveis para destino).
 */
export function useTanksWithoutBatches({
  page = 1,
  perPage = 15,
  companyId,
  enabled = true,
}: UseTanksWithoutBatchesParams = {}) {
  return useQuery({
    queryKey: ['tanks', 'without-batches', page, perPage, companyId],
    queryFn: () => tankService.listWithoutBatches({ page, perPage, companyId }),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}
