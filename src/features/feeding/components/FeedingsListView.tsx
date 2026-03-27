'use client';

import { useCallback } from 'react';
import type { Feeding, FeedingListResponse } from '../types';
import { FeedingTable } from './FeedingTable';
import { ListHeader, Pagination, SearchField, SortButton } from '@/shared/components/list';
import { ChevronRightIcon, FilterIcon, SpinnerIcon } from '@/shared/components/icons/AppIcons';

export type FeedingsListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  sortBy: string;
  setSortBy: (next: string) => void;
  data: FeedingListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  feedings: Feeding[];
};

export function FeedingsListView({
  page,
  setPage,
  search,
  setSearch,
  sortBy,
  setSortBy,
  data,
  isLoading,
  error,
  feedings,
}: Readonly<FeedingsListViewProps>) {
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
      return <div className="p-8 text-center text-red-600">Erro ao carregar alimentações.</div>;
    }

    if (!feedings.length) {
      return <div className="p-8 text-center text-slate-500">Nenhuma alimentação encontrada.</div>;
    }

    return (
      <>
        <FeedingTable feedings={feedings} />
        {data && data.total > data.limit && (
          <Pagination
            page={page}
            limit={data.limit}
            total={data.total}
            itemLabelPlural="alimentações"
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
        icon={
          <svg
            className="h-8 w-8 text-[#0EA5A4]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        }
        title="Alimentações"
        subtitle="Registro de alimentação por lote"
        ctaHref="/company/feedings/create"
        ctaLabel="Nova Alimentação"
      />

      <section className="flex flex-wrap items-center gap-3">
        <SearchField value={search} placeholder="Buscar por lote..." onChange={setSearch} />
        <SortButton current={sortBy} onSort={handleSort} value="batchName" label="Lote" />
      </section>

      <section className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {data?.total ?? 0}{' '}
          {data?.total === 1 ? 'alimentação encontrada' : 'alimentações encontradas'}
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
