'use client';

import { useQuery } from '@tanstack/react-query';
import { saleService } from '../services/saleService';

type UseSalesParams = {
  page: number;
  limit: number;
  search?: string;
  clientId?: string;
  batchId?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
  dateFrom?: string;
  dateTo?: string;
};

export function useSales(params: UseSalesParams) {
  return useQuery({
    queryKey: [
      'sales',
      'list',
      params.page,
      params.limit,
      params.search,
      params.clientId,
      params.batchId,
      params.status,
      params.dateFrom,
      params.dateTo,
    ],
    queryFn: () => saleService.list(params),
    staleTime: 1000 * 60 * 5,
  });
}

