'use client';

import { useCallback } from 'react';
import type { Mortality, MortalityListResponse } from '../types';
import { MortalityTable } from './MortalityTable';
import { ListHeader, Pagination, SearchField, SortButton } from '@/shared/components/list';
import { ChevronRightIcon, FilterIcon, SpinnerIcon } from '@/shared/components/icons/AppIcons';

export type MortalitiesListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  sortBy: string;
  setSortBy: (next: string) => void;
  data: MortalityListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  mortalities: Mortality[];
  handleDelete: (id: string, label: string) => void;
  isDeleting: boolean;
};

export function MortalitiesListView({
  page,
  setPage,
  search,
  setSearch,
  sortBy,
  setSortBy,
  data,
  isLoading,
  error,
  mortalities,
  handleDelete,
  isDeleting,
}: Readonly<MortalitiesListViewProps>) {
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
      return <div className="p-8 text-center text-red-600">Erro ao carregar mortalidades.</div>;
    }

    if (!mortalities.length) {
      return (
        <div className="p-8 text-center text-slate-500">
          Nenhum registro de mortalidade encontrado.
        </div>
      );
    }

    return (
      <>
        <MortalityTable
          mortalities={mortalities}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
        {data && data.total > data.limit && (
          <Pagination
            page={page}
            limit={data.limit}
            total={data.total}
            itemLabelPlural="registros"
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
              d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
            />
          </svg>
        }
        title="Mortalidades"
        subtitle="Registro de mortalidade por lote"
        ctaHref="/company/mortalities/create"
        ctaLabel="Nova Mortalidade"
      />

      <section className="flex flex-wrap items-center gap-3">
        <SearchField value={search} placeholder="Buscar..." onChange={setSearch} />
        <SortButton current={sortBy} onSort={handleSort} value="mortalityDate" label="Data" />
        <SortButton current={sortBy} onSort={handleSort} value="batchName" label="Lote" />
        <SortButton current={sortBy} onSort={handleSort} value="quantity" label="Quantidade" />
      </section>

      <section className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {data?.total ?? 0} {data?.total === 1 ? 'registro encontrado' : 'registros encontrados'}
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
