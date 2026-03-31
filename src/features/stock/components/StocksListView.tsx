'use client';

import { useCallback } from 'react';
import type { Stock, StockListResponse } from '../types';
import { StockTable } from './StockTable';
import { StockAdjustModal } from './StockAdjustModal';
import { ListHeader, ListPageShell, SearchField, SortButton } from '@/shared/components/list';
import { ProductsIcon } from '@/shared/components/Sidebar/menuIcons';
import type { AdjustStockPayload } from '../types';

export type StocksListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  sortBy: string;
  setSortBy: (next: string) => void;
  data: StockListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  stocks: Stock[];
  handleDelete: (id: string, label: string) => void;
  isDeleting: boolean;
  openAdjust: (id: string, label: string) => void;
  closeAdjust: () => void;
  adjustTarget: { id: string; label: string } | null;
  onConfirmAdjust: (id: string, payload: AdjustStockPayload) => void;
  isAdjusting: boolean;
};

export function StocksListView({
  page,
  setPage,
  search,
  setSearch,
  sortBy,
  setSortBy,
  data,
  isLoading,
  error,
  stocks,
  handleDelete,
  isDeleting,
  openAdjust,
  closeAdjust,
  adjustTarget,
  onConfirmAdjust,
  isAdjusting,
}: Readonly<StocksListViewProps>) {
  const handleSort = useCallback((next: string) => setSortBy(next), [setSortBy]);

  return (
    <ListPageShell
      listHeader={
        <ListHeader
          icon={<ProductsIcon />}
          title="Estoques"
          subtitle="Visão geral dos níveis de estoque de insumos"
          ctaHref="/company/stocks/create"
          ctaLabel="Novo estoque"
        />
      }
      toolbar={
        <section className="flex flex-wrap items-center gap-3">
          <SearchField value={search} placeholder="Buscar por insumo..." onChange={setSearch} />
          <SortButton current={sortBy} onSort={handleSort} value="updatedAt" label="Atualização" />
        </section>
      }
      total={data?.total ?? 0}
      totalLabelSingular="estoque encontrado"
      totalLabelPlural="estoques encontrados"
      isLoading={isLoading}
      error={error}
      errorMessage="Erro ao carregar estoques."
      isEmpty={!isLoading && !error && stocks.length === 0}
      emptyMessage="Nenhum estoque encontrado."
      pagination={
        data
          ? {
              page,
              limit: data.limit,
              total: data.total,
              itemLabelPlural: 'estoques',
              onPageChange: setPage,
            }
          : null
      }
    >
      <StockTable
        stocks={stocks}
        onDelete={handleDelete}
        isDeleting={isDeleting}
        onAdjust={openAdjust}
        isAdjusting={isAdjusting}
      />

      <StockAdjustModal
        isOpen={!!adjustTarget}
        title={adjustTarget ? `Ajustar estoque — ${adjustTarget.label}` : 'Ajustar estoque'}
        subtitle="Informe a quantidade física e o motivo do ajuste."
        isSubmitting={isAdjusting}
        onClose={closeAdjust}
        onSubmit={(payload) => {
          if (!adjustTarget) return;
          onConfirmAdjust(adjustTarget.id, payload);
        }}
      />
    </ListPageShell>
  );
}
