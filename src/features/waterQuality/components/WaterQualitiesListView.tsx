'use client';

import { useCallback } from 'react';
import type { WaterQuality, WaterQualityListResponse } from '../types';
import { WaterQualityTable } from './WaterQualityTable';
import { ListHeader, Pagination, SearchField, SortButton } from '@/shared/components/list';
import { ChevronRightIcon, FilterIcon, SpinnerIcon } from '@/shared/components/icons/AppIcons';

export type WaterQualitiesListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  sortBy: string;
  setSortBy: (next: string) => void;
  data: WaterQualityListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  waterQualities: WaterQuality[];
  handleDelete: (id: string, label: string) => void;
  isDeleting: boolean;
};

const DropletIcon = () => (
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
      d="M12 3c-4.5 5.5-8 9.5-8 13a8 8 0 1016 0c0-3.5-3.5-7.5-8-13z"
    />
  </svg>
);

export function WaterQualitiesListView({
  page,
  setPage,
  search,
  setSearch,
  sortBy,
  setSortBy,
  data,
  isLoading,
  error,
  waterQualities,
  handleDelete,
  isDeleting,
}: Readonly<WaterQualitiesListViewProps>) {
  const handleSort = useCallback((next: string) => setSortBy(next), [setSortBy]);

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
        <div className="p-8 text-center text-red-600">Erro ao carregar qualidade da água.</div>
      );
    }

    if (!waterQualities.length) {
      return <div className="p-8 text-center text-slate-500">Nenhum registro encontrado.</div>;
    }

    return (
      <>
        <WaterQualityTable
          waterQualities={waterQualities}
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

  return (
    <div className="space-y-6">
      <ListHeader
        icon={<DropletIcon />}
        title="Qualidade da água"
        subtitle="Medições de pH, oxigênio, temperatura e amônia por tanque"
        ctaHref="/company/water-qualities/create"
        ctaLabel="Nova medição"
      />

      <section className="flex flex-wrap items-center gap-3">
        <SearchField value={search} placeholder="Buscar por tanque..." onChange={setSearch} />
        <SortButton current={sortBy} onSort={handleSort} value="measuredAt" label="Data" />
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
