'use client';

import { useCallback } from 'react';
import type { Stocking, StockingListResponse } from '../types';
import { StockingTable } from './StockingTable';
import { ListHeader, Pagination, SearchField, SortButton } from '@/shared/components/list';
import {
  ChevronRightIcon,
  CircleIcon,
  FilterIcon,
  SpinnerIcon,
} from '@/shared/components/icons/AppIcons';

export type StockingsListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  sortBy: string;
  setSortBy: (next: string) => void;
  data: StockingListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  stockings: Stocking[];
  total: number;
  limit: number;
  batchMap: Record<string, string>;
  handleDelete: (id: string, label: string) => void;
  isDeleting: boolean;
};

export function StockingsListView({
  page,
  setPage,
  search,
  setSearch,
  sortBy,
  setSortBy,
  data,
  isLoading,
  error,
  stockings,
  total,
  limit,
  batchMap,
  handleDelete,
  isDeleting,
}: Readonly<StockingsListViewProps>) {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="p-8 text-center">
          <div className="flex items-center justify-center gap-2 text-slate-500">
            <SpinnerIcon className="w-5 h-5 animate-spin" />
            <span>Carregando...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-8 text-center text-red-600">
          Erro ao carregar povoamentos. Tente novamente mais tarde.
        </div>
      );
    }

    if (!stockings.length) {
      const emptyTitle = search
        ? 'Nenhum povoamento encontrado com os filtros aplicados.'
        : 'Nenhum povoamento cadastrado.';
      const emptySubtitle = search
        ? 'Tente alterar a busca.'
        : 'Clique em Novo Povoamento para criar o primeiro.';
      return (
        <div className="p-8 text-center text-slate-500">
          <p className="text-base">{emptyTitle}</p>
          <p className="mt-1 text-sm">{emptySubtitle}</p>
        </div>
      );
    }

    return (
      <>
        <StockingTable
          stockings={stockings}
          batchMap={batchMap}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />

        {data && total > limit && (
          <Pagination
            page={page}
            limit={limit}
            total={total}
            itemLabelPlural="povoamentos"
            onPageChange={setPage}
          />
        )}
      </>
    );
  };

  const handleSort = useCallback((next: string) => setSortBy(next), [setSortBy]);

  return (
    <div className="space-y-6">
      <ListHeader
        icon={<CircleIcon className="h-8 w-8 text-[#0EA5A4]" />}
        title="Povoamentos"
        subtitle="Gerencie e acompanhe os povoamentos de lotes"
        ctaHref="/company/stockings/create"
        ctaLabel="Novo Povoamento"
      />

      <section className="flex flex-wrap items-center gap-3">
        <SearchField value={search} placeholder="Buscar povoamento..." onChange={setSearch} />
        <SortButton current={sortBy} onSort={handleSort} />
      </section>

      <section className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {total} {total === 1 ? 'povoamento encontrado' : 'povoamentos encontrados'}
        </p>
        <button
          type="button"
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          <FilterIcon className="h-4 w-4" />
          Filtros avançados
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </section>

      <main className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
}
