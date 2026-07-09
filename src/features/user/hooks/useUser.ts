'use client';

import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/userService';

/**
 * Hook para buscar um usuário por ID
 */
export function useUser(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['users', 'detail', id],
    queryFn: () => {
      if (!id) throw new Error('ID é obrigatório');
      return userService.getById(id);
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
