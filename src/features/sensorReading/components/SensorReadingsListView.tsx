'use client';

import { useCallback } from 'react';
import type { SensorReading, SensorReadingListResponse } from '../types';
import { SensorReadingTable } from './SensorReadingTable';
import { ListHeader, Pagination, SearchField, SortButton } from '@/shared/components/list';
import { ChevronRightIcon, FilterIcon, SpinnerIcon } from '@/shared/components/icons/AppIcons';

export type SensorReadingsListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  sortBy: string;
  setSortBy: (next: string) => void;
  data: SensorReadingListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  sensorReadings: SensorReading[];
  handleDelete: (id: string, label: string) => void;
  isDeleting: boolean;
};

export function SensorReadingsListView({
  page,
  setPage,
  search,
  setSearch,
  sortBy,
  setSortBy,
  data,
  isLoading,
  error,
  sensorReadings,
  handleDelete,
  isDeleting,
}: Readonly<SensorReadingsListViewProps>) {
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
      return <div className="p-8 text-center text-red-600">Erro ao carregar leituras.</div>;
    }

    if (!sensorReadings.length) {
      return <div className="p-8 text-center text-slate-500">Nenhuma leitura encontrada.</div>;
    }

    return (
      <>
        <SensorReadingTable
          sensorReadings={sensorReadings}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
        {data && data.total > data.limit && (
          <Pagination
            page={page}
            limit={data.limit}
            total={data.total}
            itemLabelPlural="leituras"
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        }
        title="Leituras de sensores"
        subtitle="Histórico de medições registradas pelos sensores"
        ctaHref="/company/sensor-readings/create"
        ctaLabel="Nova leitura"
      />

      <section className="flex flex-wrap items-center gap-3">
        <SearchField
          value={search}
          placeholder="Buscar por tanque, tipo ou unidade..."
          onChange={setSearch}
        />
        <SortButton current={sortBy} onSort={handleSort} value="measuredAt" label="Data" />
      </section>

      <section className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {data?.total ?? 0} {data?.total === 1 ? 'leitura encontrada' : 'leituras encontradas'}
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
