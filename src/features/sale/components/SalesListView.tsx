'use client';

import { useCallback } from 'react';
import type { Sale, SaleListResponse } from '../types';
import { SaleTable } from './SaleTable';
import { ListHeader, ListPageShell, SearchField, SortButton } from '@/shared/components/list';
import { OrdersIcon } from '@/shared/components/Sidebar/menuIcons';
import { Input, Select } from '@/shared/components/ui';

export type SalesListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  sortBy: string;
  setSortBy: (next: string) => void;
  data: SaleListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  sales: Sale[];
  status: 'all' | 'pending' | 'confirmed' | 'cancelled';
  setStatus: (next: 'all' | 'pending' | 'confirmed' | 'cancelled') => void;
  dateFrom: string;
  setDateFrom: (next: string) => void;
  dateTo: string;
  setDateTo: (next: string) => void;
  onDeleteSale?: (id: string, label: string) => void;
  isDeletingSale?: boolean;
  onCancelSale?: (id: string, label: string) => void;
  isCancellingSale?: boolean;
};

export function SalesListView({
  page,
  setPage,
  search,
  setSearch,
  sortBy,
  setSortBy,
  data,
  isLoading,
  error,
  sales,
  status,
  setStatus,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  onDeleteSale,
  isDeletingSale = false,
  onCancelSale,
  isCancellingSale = false,
}: Readonly<SalesListViewProps>) {
  const handleSort = useCallback((next: string) => setSortBy(next), [setSortBy]);

  return (
    <ListPageShell
      listHeader={
        <ListHeader
          icon={<OrdersIcon />}
          title="Vendas"
          subtitle="Relação de vendas por cliente e lote"
          ctaHref="/company/sales/create"
          ctaLabel="Nova venda"
        />
      }
      toolbar={
        <section className="flex flex-wrap items-end gap-3">
          <SearchField
            value={search}
            placeholder="Buscar por cliente ou lote..."
            onChange={setSearch}
          />
          <Select
            label="Status"
            value={status}
            labelInline={true}
            onChange={(e) =>
              setStatus(e.target.value as 'all' | 'pending' | 'confirmed' | 'cancelled')
            }
            options={[
              { value: 'all', label: 'Todos' },
              { value: 'pending', label: 'Pendente' },
              { value: 'confirmed', label: 'Confirmado' },
              { value: 'cancelled', label: 'Cancelado' },
            ]}
          />
          <Input
            label="De"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <Input
            label="Até"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
          <SortButton current={sortBy} onSort={handleSort} value="saleDate" label="Data" />
        </section>
      }
      total={data?.total ?? 0}
      totalLabelSingular="venda encontrada"
      totalLabelPlural="vendas encontradas"
      isLoading={isLoading}
      error={error}
      errorMessage="Erro ao carregar vendas."
      isEmpty={!isLoading && !error && sales.length === 0}
      emptyMessage="Nenhuma venda encontrada."
      pagination={
        data
          ? {
              page,
              limit: data.limit,
              total: data.total,
              itemLabelPlural: 'vendas',
              onPageChange: setPage,
            }
          : null
      }
    >
      <SaleTable
        sales={sales}
        onDelete={onDeleteSale}
        isDeleting={isDeletingSale}
        onCancel={onCancelSale}
        isCancelling={isCancellingSale}
      />
    </ListPageShell>
  );
}
