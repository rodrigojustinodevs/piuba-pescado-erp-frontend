'use client';

import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/userService';

interface UseUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  enabled?: boolean;
}

/**
 * Hook para listar usuários com paginação
 */
export function useUsers({ page = 1, limit = 10, search, enabled = true }: UseUsersParams = {}) {
  return useQuery({
    queryKey: ['users', 'list', page, limit, search],
    queryFn: () => userService.list({ page, limit, search }),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
