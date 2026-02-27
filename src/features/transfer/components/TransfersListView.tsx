'use client';

import { useCallback } from 'react';
import type { Transfer, TransferListResponse } from '../types';
import { TransferTable } from './TransferTable';
import { ListHeader, Pagination, SearchField, SortButton } from '@/shared/components/list';
import {
  ListEmptyState,
  ListErrorState,
  ListLoadingState,
} from '@/shared/components/states/ListStates';
import { ChevronRightIcon, CircleIcon, FilterIcon } from '@/shared/components/icons/AppIcons';

export type TransfersListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  sortBy: string;
  setSortBy: (next: string) => void;
  data: TransferListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  transfers: Transfer[];
  total: number;
  limit: number;
  batchMap: Record<string, string>;
  tankMap: Record<string, string>;
  handleDelete: (id: string) => void;
  isDeleting: boolean;
};

export function TransfersListView({
  page,
  setPage,
  search,
  setSearch,
  sortBy,
  setSortBy,
  data,
  isLoading,
  error,
  transfers,
  total,
  limit,
  batchMap,
  tankMap,
  handleDelete,
  isDeleting,
}: Readonly<TransfersListViewProps>) {
  const renderContent = () => {
    if (isLoading) return <ListLoadingState />;

    if (error) {
      return (
        <ListErrorState
          title="Erro ao carregar transferências"
          message="Não foi possível carregar as transferências. Tente novamente mais tarde."
        />
      );
    }

    if (!transfers.length) {
      return (
        <ListEmptyState
          title={
            search
              ? 'Nenhuma transferência encontrada com os filtros aplicados.'
              : 'Nenhuma transferência cadastrada.'
          }
          subtitle={
            search
              ? 'Tente alterar a busca.'
              : 'Clique em Nova Transferência para criar a primeira.'
          }
        />
      );
    }

    return (
      <>
        <TransferTable
          transfers={transfers}
          batchMap={batchMap}
          tankMap={tankMap}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />

        {data && total > limit && (
          <Pagination
            page={page}
            limit={limit}
            total={total}
            itemLabelPlural="transferências"
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
        title="Transferências"
        subtitle="Gerencie e acompanhe as transferências entre tanques"
        ctaHref="/company/transfers/create"
        ctaLabel="Nova Transferência"
      />

      <section className="flex flex-wrap items-center gap-3">
        <SearchField value={search} placeholder="Buscar transferência..." onChange={setSearch} />
        <SortButton current={sortBy} onSort={handleSort} />
      </section>

      <section className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {total} {total === 1 ? 'transferência encontrada' : 'transferências encontradas'}
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
