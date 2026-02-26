'use client';

import { useCallback } from 'react';
import type { Batch, BatchListResponse } from '../types';
import { BatchTable } from './BatchTable';
import {
  ListHeader,
  Pagination,
  SearchField,
  SortButton,
  StatusFilterTabs,
} from '@/shared/components/list';
import {
  ChevronRightIcon,
  CircleIcon,
  FilterIcon,
  SpinnerIcon,
} from '@/shared/components/icons/AppIcons';
import type { BatchStatusFilter } from '../hooks/useBatchesListPage';

export type BatchesListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  filter: BatchStatusFilter;
  setFilter: (next: BatchStatusFilter) => void;
  sortBy: string;
  setSortBy: (next: string) => void;
  data: BatchListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  filteredBatches: Batch[];
  stats: {
    total: number;
    finishedCount: number;
  };
  handleDelete: (id: string, species: string) => void;
  isDeleting: boolean;
};

export function BatchesListView({
  page,
  setPage,
  search,
  setSearch,
  filter,
  setFilter,
  sortBy,
  setSortBy,
  data,
  isLoading,
  error,
  filteredBatches,
  stats,
  handleDelete,
  isDeleting,
}: Readonly<BatchesListViewProps>) {
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
          Erro ao carregar lotes. Tente novamente mais tarde.
        </div>
      );
    }

    if (!filteredBatches.length) {
      return (
        <div className="p-8 text-center text-slate-500">
          <p className="text-base">
            {search || filter !== 'all'
              ? 'Nenhum lote encontrado com os filtros aplicados.'
              : 'Nenhum lote cadastrado.'}
          </p>
          <p className="mt-1 text-sm">
            {search || filter !== 'all'
              ? 'Tente alterar a busca ou os filtros.'
              : 'Clique em Novo Lote para criar o primeiro.'}
          </p>
        </div>
      );
    }

    return (
      <>
        <BatchTable batches={filteredBatches} onDelete={handleDelete} isDeleting={isDeleting} />

        {data && data.total > data.limit && (
          <Pagination
            page={page}
            limit={data.limit}
            total={data.total}
            itemLabelPlural="lotes"
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
        title="Lotes"
        subtitle="Gerencie e acompanhe os lotes de cultivo"
        ctaHref="/company/batches/create"
        ctaLabel="Novo Lote"
      />

      <section className="flex flex-wrap items-center gap-3">
        <SearchField
          value={search}
          placeholder="Buscar por nome, espécie, tanque..."
          onChange={setSearch}
        />

        <StatusFilterTabs<BatchStatusFilter>
          filter={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'Todos' },
            { value: 'active', label: 'Ativos' },
            { value: 'finished', label: 'Finalizados', badgeCount: stats.finishedCount },
          ]}
        />

        <SortButton current={sortBy} onSort={handleSort} />
      </section>

      <section className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {stats.total} {stats.total === 1 ? 'lote encontrado' : 'lotes encontrados'}
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
