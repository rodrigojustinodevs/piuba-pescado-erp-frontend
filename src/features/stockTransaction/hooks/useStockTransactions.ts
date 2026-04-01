'use client';

import { useQuery } from '@tanstack/react-query';
import { stockTransactionService } from '../services/stockTransactionService';

export function useStockTransactions(params: {
  page: number;
  limit: number;
  referenceType?: string;
  referenceId?: string;
}) {
  return useQuery({
    queryKey: [
      'stockTransactions',
      'list',
      params.page,
      params.limit,
      params.referenceType,
      params.referenceId,
    ],
    queryFn: () =>
      stockTransactionService.list({
        page: params.page,
        limit: params.limit,
        referenceType: params.referenceType,
        referenceId: params.referenceId,
      }),
    staleTime: 1000 * 60 * 5,
  });
}

