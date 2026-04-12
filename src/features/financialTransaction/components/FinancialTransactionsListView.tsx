'use client';

import { useCallback } from 'react';
import type { FinancialTransaction, FinancialTransactionListResponse } from '../types';
import { FinancialTransactionTable } from './FinancialTransactionTable';
import { ListHeader, ListPageShell, SearchField, SortButton } from '@/shared/components/list';
import { MoneyIcon } from '@/shared/components/Sidebar/menuIcons';

export type FinancialTransactionsListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  sortBy: string;
  setSortBy: (next: string) => void;
  data: FinancialTransactionListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  financialTransactions: FinancialTransaction[];
};

export function FinancialTransactionsListView({
  page,
  setPage,
  search,
  setSearch,
  sortBy,
  setSortBy,
  data,
  isLoading,
  error,
  financialTransactions,
}: Readonly<FinancialTransactionsListViewProps>) {
  const handleSort = useCallback((next: string) => setSortBy(next), [setSortBy]);

  return (
    <ListPageShell
      listHeader={
        <ListHeader
          icon={<MoneyIcon />}
          title="Transações financeiras"
          subtitle="Relação de contas a pagar e receber da empresa"
        />
      }
      toolbar={
        <section className="flex flex-wrap items-center gap-3 w-full">
          <SearchField
            value={search}
            placeholder="Buscar por descrição, categoria ou referência..."
            onChange={setSearch}
          />
          <SortButton current={sortBy} onSort={handleSort} value="dueDate" label="Vencimento" />
        </section>
      }
      total={data?.total ?? 0}
      totalLabelSingular="transação encontrada"
      totalLabelPlural="transações encontradas"
      isLoading={isLoading}
      error={error}
      errorMessage="Erro ao carregar transações financeiras."
      isEmpty={!isLoading && !error && financialTransactions.length === 0}
      emptyMessage="Nenhuma transação financeira encontrada."
      pagination={
        data
          ? {
              page,
              limit: data.limit,
              total: data.total,
              itemLabelPlural: 'transações',
              onPageChange: setPage,
            }
          : null
      }
    >
      <FinancialTransactionTable financialTransactions={financialTransactions} />
    </ListPageShell>
  );
}

