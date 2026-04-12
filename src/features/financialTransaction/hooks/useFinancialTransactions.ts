'use client';

import { useQuery } from '@tanstack/react-query';
import { financialTransactionService } from '../services/financialTransactionService';

export function useFinancialTransactions(params: {
  page: number;
  limit: number;
  search?: string;
}) {
  return useQuery({
    queryKey: ['financialTransactions', 'list', params.page, params.limit, params.search],
    queryFn: () =>
      financialTransactionService.list({
        page: params.page,
        limit: params.limit,
        search: params.search,
      }),
    staleTime: 1000 * 60 * 5,
  });
}

