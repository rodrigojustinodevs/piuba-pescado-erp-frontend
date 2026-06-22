'use client';

import { useQuery } from '@tanstack/react-query';
import { tankService } from '../services/tankService';

interface UseTankTypesParams {
  enabled?: boolean;
}

/**
 * Hook para listar tipos de tanque
 */
export function useTankTypes({ enabled = true }: UseTankTypesParams = {}) {
  return useQuery({
    queryKey: ['tanks', 'types'],
    queryFn: () => tankService.getTankTypes(),
    staleTime: 1000 * 60 * 30,
    enabled,
  });
}
