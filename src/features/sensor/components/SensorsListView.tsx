'use client';

import { useCallback } from 'react';
import type { Sensor, SensorListResponse } from '../types';
import { SensorTable } from './SensorTable';
import { ListHeader, Pagination, SearchField, SortButton } from '@/shared/components/list';
import { ChevronRightIcon, FilterIcon, SpinnerIcon } from '@/shared/components/icons/AppIcons';

export type SensorsListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  sortBy: string;
  setSortBy: (next: string) => void;
  data: SensorListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  sensors: Sensor[];
  handleDelete: (id: string, label: string) => void;
  isDeleting: boolean;
};

export function SensorsListView({
  page,
  setPage,
  search,
  setSearch,
  sortBy,
  setSortBy,
  data,
  isLoading,
  error,
  sensors,
  handleDelete,
  isDeleting,
}: Readonly<SensorsListViewProps>) {
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
      return <div className="p-8 text-center text-red-600">Erro ao carregar sensores.</div>;
    }

    if (!sensors.length) {
      return <div className="p-8 text-center text-slate-500">Nenhum sensor encontrado.</div>;
    }

    return (
      <>
        <SensorTable sensors={sensors} onDelete={handleDelete} isDeleting={isDeleting} />
        {data && data.total > data.limit && (
          <Pagination
            page={page}
            limit={data.limit}
            total={data.total}
            itemLabelPlural="sensores"
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
              d="M8 14s1.5 2 4 2 4-2 4-2m-8 4s1.5 2 4 2 4-2 4-2M6 6h12M6 10h12"
            />
          </svg>
        }
        title="Sensores"
        subtitle="Monitore os sensores instalados nos tanques"
        ctaHref="/company/sensors/create"
        ctaLabel="Novo Sensor"
      />

      <section className="flex flex-wrap items-center gap-3">
        <SearchField value={search} placeholder="Buscar por tipo, status ou tanque..." onChange={setSearch} />
        <SortButton current={sortBy} onSort={handleSort} value="installationDate" label="Instalação" />
        <SortButton current={sortBy} onSort={handleSort} value="tankName" label="Tanque" />
        <SortButton current={sortBy} onSort={handleSort} value="sensorType" label="Tipo" />
      </section>

      <section className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {data?.total ?? 0} {data?.total === 1 ? 'sensor encontrado' : 'sensores encontrados'}
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
