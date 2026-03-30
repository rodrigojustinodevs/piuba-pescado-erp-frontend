'use client';

import { useCallback } from 'react';
import type { Purchase, PurchaseListResponse } from '../types';
import { PurchaseTable } from './PurchaseTable';
import { ListHeader, ListPageShell, SearchField, SortButton } from '@/shared/components/list';
import { OrdersIcon } from '@/shared/components/Sidebar/menuIcons';

export type PurchasesListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  sortBy: string;
  setSortBy: (next: string) => void;
  data: PurchaseListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  purchases: Purchase[];
  handleDelete: (id: string, label: string) => void;
  isDeleting: boolean;
  handleReceive: (id: string, label: string) => void;
  isReceiving: boolean;
  handleCancel: (id: string, label: string) => void;
  isCancelling: boolean;
};

export function PurchasesListView({
  page,
  setPage,
  search,
  setSearch,
  sortBy,
  setSortBy,
  data,
  isLoading,
  error,
  purchases,
  handleDelete,
  isDeleting,
  handleReceive,
  isReceiving,
  handleCancel,
  isCancelling,
}: Readonly<PurchasesListViewProps>) {
  const handleSort = useCallback((next: string) => setSortBy(next), [setSortBy]);

  return (
    <ListPageShell
      listHeader={
        <ListHeader
          icon={<OrdersIcon />}
          title="Compras"
          subtitle="Pedidos de insumos e fornecedores"
          ctaHref="/company/purchases/create"
          ctaLabel="Nova compra"
        />
      }
      toolbar={
        <section className="flex flex-wrap items-center gap-3">
          <SearchField
            value={search}
            placeholder="Buscar por fornecedor ou documento..."
            onChange={setSearch}
          />
          <SortButton current={sortBy} onSort={handleSort} value="purchaseDate" label="Data" />
        </section>
      }
      total={data?.total ?? 0}
      totalLabelSingular="compra encontrada"
      totalLabelPlural="compras encontradas"
      isLoading={isLoading}
      error={error}
      errorMessage="Erro ao carregar compras."
      isEmpty={!isLoading && !error && purchases.length === 0}
      emptyMessage="Nenhuma compra encontrada."
      pagination={
        data
          ? {
              page,
              limit: data.limit,
              total: data.total,
              itemLabelPlural: 'compras',
              onPageChange: setPage,
            }
          : null
      }
    >
      <PurchaseTable
        purchases={purchases}
        onDelete={handleDelete}
        isDeleting={isDeleting}
        onReceive={handleReceive}
        isReceiving={isReceiving}
        onCancel={handleCancel}
        isCancelling={isCancelling}
      />
    </ListPageShell>
  );
}
