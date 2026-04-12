'use client';

import { useMemo } from 'react';
import type { FinancialTransaction } from '../types';
import { useFinancialTransactions } from './useFinancialTransactions';
import { useListPageState } from '@/shared/hooks/useListPageState';

const PER_PAGE = 25;

function sortFinancialTransactions(list: FinancialTransaction[], sortBy: string): FinancialTransaction[] {
  const rows = [...list];
  switch (sortBy) {
    case 'amount':
      return rows.sort((a, b) => b.amount - a.amount);
    case 'updatedAt':
      return rows.sort(
        (a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime(),
      );
    case 'dueDate':
    default:
      return rows.sort((a, b) => new Date(b.dueDate || 0).getTime() - new Date(a.dueDate || 0).getTime());
  }
}

export function useFinancialTransactionsListPage() {
  const listState = useListPageState({ initialSortBy: 'dueDate' });
  const { page, setPage, search, setSearch, sortBy, setSortBy } = listState;

  const { data, isLoading, error } = useFinancialTransactions({
    page,
    limit: PER_PAGE,
    search: search.trim() || undefined,
  });

  const financialTransactions = useMemo(
    () => data?.financialTransactions ?? [],
    [data?.financialTransactions],
  );
  const sortedFinancialTransactions = useMemo(
    () => sortFinancialTransactions(financialTransactions, sortBy),
    [financialTransactions, sortBy],
  );

  return {
    page,
    setPage,
    search,
    setSearch,
    sortBy,
    setSortBy,
    data,
    isLoading,
    error,
    financialTransactions: sortedFinancialTransactions,
    limit: data?.limit ?? PER_PAGE,
    total: data?.total ?? 0,
  };
}

