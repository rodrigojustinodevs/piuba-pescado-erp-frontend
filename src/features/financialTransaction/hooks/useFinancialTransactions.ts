'use client';

import { useQuery } from '@tanstack/react-query';
import { financialTransactionService } from '../services/financialTransactionService';

export function useFinancialTransactions(params: {
  page: number;
  limit: number;
  search?: string;
  type?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: [
      'financialTransactions',
      'list',
      params.page,
      params.limit,
      params.search,
      params.type,
      params.status,
    ],
    queryFn: () =>
      financialTransactionService.list({
        page: params.page,
        limit: params.limit,
        search: params.search,
        type: params.type,
        status: params.status,
      }),
    staleTime: 1000 * 60 * 5,
  });
}
