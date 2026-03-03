'use client';

import { useQuery } from '@tanstack/react-query';
import { biometryService } from '../services/biometryService';

interface UseBiometriesParams {
  page?: number;
  limit?: number;
  search?: string;
  enabled?: boolean;
}

/**
 * Hook para listar biometrias com paginação
 */
export function useBiometries({
  page = 1,
  limit = 15,
  search,
  enabled = true,
}: UseBiometriesParams = {}) {
  return useQuery({
    queryKey: ['biometries', 'list', page, limit, search],
    queryFn: () => biometryService.list({ page, limit, search }),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
