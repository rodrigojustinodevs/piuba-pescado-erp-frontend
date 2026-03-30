'use client';

import { useQuery } from '@tanstack/react-query';
import { supplierService } from '../services/supplierService';

interface UseSuppliersParams {
  page?: number;
  limit?: number;
  search?: string;
  enabled?: boolean;
}

export function useSuppliers({ page = 1, limit = 25, search, enabled = true }: UseSuppliersParams = {}) {
  return useQuery({
    queryKey: ['suppliers', 'list', page, limit, search],
    queryFn: () => supplierService.list({ page, limit, search }),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}
