'use client';

import { useMemo, useState } from 'react';
import type { StockTransactionReferenceType } from '../types';
import { useStockTransactions } from './useStockTransactions';
import { useListPageState } from '@/shared/hooks/useListPageState';

const PER_PAGE = 25;

export function useStockTransactionsListPage() {
  const listState = useListPageState({ initialSortBy: 'createdAt' });
  const { page, setPage } = listState;
  const [referenceType, setReferenceType] = useState<StockTransactionReferenceType | 'all'>('all');
  const [referenceId, setReferenceId] = useState('');

  const { data, isLoading, error } = useStockTransactions({
    page,
    limit: PER_PAGE,
    referenceType: referenceType === 'all' ? undefined : referenceType,
    referenceId: referenceId.trim() || undefined,
  });

  const transactions = useMemo(() => data?.transactions ?? [], [data?.transactions]);

  return {
    page,
    setPage,
    referenceType,
    setReferenceType,
    referenceId,
    setReferenceId,
    data,
    isLoading,
    error,
    transactions,
    limit: data?.limit ?? PER_PAGE,
    total: data?.total ?? 0,
  };
}

