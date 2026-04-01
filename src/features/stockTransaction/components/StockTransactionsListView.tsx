'use client';

import { useCallback, useMemo } from 'react';
import type {
  StockTransaction,
  StockTransactionListResponse,
  StockTransactionReferenceType,
} from '../types';
import { StockTransactionTable } from './StockTransactionTable';
import { ListHeader, ListPageShell, SearchField, SortButton } from '@/shared/components/list';
import { ProductsIcon } from '@/shared/components/Sidebar/menuIcons';
import { Select } from '@/shared/components/ui';

const REFERENCE_TYPE_OPTIONS: Array<{
  value: StockTransactionReferenceType | 'all';
  label: string;
}> = [
  { value: 'all', label: 'Todos' },
  { value: 'purchase_item', label: 'Item de compra' },
  { value: 'feeding', label: 'Alimentação' },
  { value: 'adjustment', label: 'Ajuste' },
  { value: 'transfer', label: 'Transferência' },
  { value: 'stocking', label: 'Povoamento' },
  { value: 'sale', label: 'Venda' },
];

export type StockTransactionsListViewProps = {
  page: number;
  setPage: (next: number) => void;
  referenceType: StockTransactionReferenceType | 'all';
  setReferenceType: (next: StockTransactionReferenceType | 'all') => void;
  referenceId: string;
  setReferenceId: (next: string) => void;
  data: StockTransactionListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  transactions: StockTransaction[];
};

export function StockTransactionsListView({
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
}: Readonly<StockTransactionsListViewProps>) {
  const options = useMemo(
    () => REFERENCE_TYPE_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
    [],
  );
  const handleSort = useCallback((_next: string) => {}, []);

  return (
    <ListPageShell
      listHeader={
        <ListHeader
          icon={<ProductsIcon />}
          title="Movimentações de estoque"
          subtitle="Movimentações por referência (compra, ajuste, transferência, etc.)"
        />
      }
      toolbar={
        <section className="flex flex-wrap items-center gap-3 w-full">
          <SearchField
            value={referenceId}
            placeholder="Filtrar por reference_id (UUID)..."
            onChange={setReferenceId}
          />
          <div className="min-w-[220px]">
            <Select
              label="Tipo de referência"
              labelInline={true}
              options={options}
              value={referenceType}
              onChange={(e) =>
                setReferenceType(e.target.value as StockTransactionReferenceType | 'all')
              }
            />
          </div>
          <SortButton current="createdAt" onSort={handleSort} value="createdAt" label="Data" />
        </section>
      }
      total={data?.total ?? 0}
      totalLabelSingular="transação encontrada"
      totalLabelPlural="transações encontradas"
      isLoading={isLoading}
      error={error}
      errorMessage="Erro ao carregar transações."
      isEmpty={!isLoading && !error && transactions.length === 0}
      emptyMessage="Nenhuma transação encontrada."
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
      <StockTransactionTable transactions={transactions} />
    </ListPageShell>
  );
}
