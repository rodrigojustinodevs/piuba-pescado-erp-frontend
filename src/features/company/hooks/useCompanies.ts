'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { companyService } from '../services/companyService';

interface UseCompaniesParams {
  page?: number;
  limit?: number;
  search?: string;
  enabled?: boolean;
}

/**
 * Hook para listar empresas com paginação.
 * `/api/companies` é exclusiva do master: para os demais perfis a consulta nem dispara.
 */
export function useCompanies({
  page = 1,
  limit = 10,
  search,
  enabled = true,
}: UseCompaniesParams = {}) {
  const { isMaster } = useAuthContext();
  return useQuery({
    queryKey: ['companies', 'list', page, limit, search],
    queryFn: () => companyService.list({ page, limit, search }),
    enabled: enabled && isMaster(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
