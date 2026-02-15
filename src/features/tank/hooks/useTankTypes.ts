'use client';

import { useQuery } from '@tanstack/react-query';
import { tankService } from '../services/tankService';

/**
 * Hook para listar tipos de tanque
 */
export function useTankTypes() {
  return useQuery({
    queryKey: ['tanks', 'types'],
    queryFn: () => tankService.getTankTypes(),
    staleTime: 1000 * 60 * 30, // 30 minutos (tipos não mudam frequentemente)
  });
}
