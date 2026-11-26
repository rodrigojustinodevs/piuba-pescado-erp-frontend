'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { companyService } from '../services/companyService';

/**
 * Hook para buscar uma empresa por ID.
 * `/api/companies/:id` é exclusiva do master: para os demais perfis a consulta nem dispara.
 */
export function useCompany(id: string | undefined, enabled = true) {
  const { isMaster } = useAuthContext();
  return useQuery({
    queryKey: ['companies', 'detail', id],
    queryFn: () => {
      if (!id) throw new Error('ID é obrigatório');
      return companyService.getById(id);
    },
    enabled: enabled && !!id && isMaster(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
