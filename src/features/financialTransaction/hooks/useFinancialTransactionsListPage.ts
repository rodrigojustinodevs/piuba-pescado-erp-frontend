'use client';

import { useCallback, useMemo, useState } from 'react';
import type {
  FinancialTransaction,
  FinancialTransactionCatalogStats,
  FinancialTransactionStatus,
  FinancialTransactionType,
} from '../types';
import { useFinancialTransactions } from './useFinancialTransactions';
import { useDeleteFinancialTransaction } from './useDeleteFinancialTransaction';
import { useListPageState } from '@/shared/hooks/useListPageState';
import { useAlertModal } from '@/shared/components/AlertModal';

const PER_PAGE = 25;

type StatusTab = FinancialTransactionStatus | 'all';
type TypeFilter = Exclude<FinancialTransactionType, 'other'> | 'all';

function sortTransactions(list: FinancialTransaction[], sortBy: string): FinancialTransaction[] {
  const rows = [...list];
  if (sortBy === 'amount') return rows.sort((a, b) => b.amount - a.amount);
  if (sortBy === 'updatedAt') {
    return rows.sort(
      (a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime(),
    );
  }
  return rows.sort(
    (a, b) => new Date(b.dueDate || 0).getTime() - new Date(a.dueDate || 0).getTime(),
  );
}

export function useFinancialTransactionsListPage() {
  const listState = useListPageState({ initialSortBy: 'dueDate' });
  const { page, setPage, search, setSearch, sortBy, setSortBy } = listState;

  const [statusTab, setStatusTab] = useState<StatusTab>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

  const deleteTransaction = useDeleteFinancialTransaction();
  const { showError } = useAlertModal();

  const { data, isLoading, error } = useFinancialTransactions({
    page,
    limit: PER_PAGE,
    search: search.trim() || undefined,
    type: typeFilter === 'all' ? undefined : typeFilter,
    status: statusTab === 'all' ? undefined : statusTab,
  });

  const financialTransactions = useMemo(() => {
    const rows = data?.financialTransactions ?? [];
    return sortTransactions(rows, sortBy);
  }, [data?.financialTransactions, sortBy]);

  const stats = useMemo<FinancialTransactionCatalogStats>(() => {
    const all = data?.financialTransactions ?? [];
    return {
      total: data?.total ?? 0,
      totalReceivable: all
        .filter((t) => t.type === 'income' && t.status === 'pending')
        .reduce((acc, t) => acc + t.amount, 0),
      totalPayable: all
        .filter((t) => t.type === 'expense' && t.status === 'pending')
        .reduce((acc, t) => acc + t.amount, 0),
      overdueCount: all.filter((t) => t.status === 'overdue').length,
    };
  }, [data]);

  const handleDelete = useCallback(
    (id: string, label: string) => {
      showError(
        'Confirmar exclusão',
        `Tem certeza que deseja excluir a transação "${label}"? Esta ação não pode ser desfeita.`,
        'Sim, excluir',
        () => deleteTransaction.mutate(id),
      );
    },
    [showError, deleteTransaction],
  );

  return {
    page,
    setPage,
    search,
    setSearch,
    sortBy,
    setSortBy,
    statusTab,
    setStatusTab,
    typeFilter,
    setTypeFilter,
    data,
    isLoading,
    error,
    financialTransactions,
    stats,
    limit: data?.limit ?? PER_PAGE,
    total: data?.total ?? 0,
    handleDelete,
    isDeleting: deleteTransaction.isPending,
  };
}
