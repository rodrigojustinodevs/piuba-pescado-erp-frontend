'use client';

import { useCallback } from 'react';
import type { SensorReading, SensorReadingListResponse } from '../types';
import { SensorReadingTable } from './SensorReadingTable';
import { ListHeader, ListPageShell, SearchField, SortButton } from '@/shared/components/list';
import { SensorReadingBarChartIcon } from '@/shared/components/icons/FeatureEntityIcons';

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
  const handleSort = useCallback((next: string) => setSortBy(next), [setSortBy]);

  return (
    <ListPageShell
      listHeader={
        <ListHeader
          icon={<SensorReadingBarChartIcon />}
          title="Leituras de sensores"
          subtitle="Histórico de medições registradas pelos sensores"
          ctaHref="/company/sensor-readings/create"
          ctaLabel="Nova leitura"
        />
      }
      toolbar={
        <section className="flex flex-wrap items-center gap-3">
          <SearchField
            value={search}
            placeholder="Buscar por tanque, tipo ou unidade..."
            onChange={setSearch}
          />
          <SortButton current={sortBy} onSort={handleSort} value="measuredAt" label="Data" />
        </section>
      }
      total={data?.total ?? 0}
      totalLabelSingular="leitura encontrada"
      totalLabelPlural="leituras encontradas"
      isLoading={isLoading}
      error={error}
      errorMessage="Erro ao carregar leituras."
      isEmpty={!isLoading && !error && sensorReadings.length === 0}
      emptyMessage="Nenhuma leitura encontrada."
      pagination={
        data
          ? {
              page,
              limit: data.limit,
              total: data.total,
              itemLabelPlural: 'leituras',
              onPageChange: setPage,
            }
          : null
      }
    >
      <SensorReadingTable
        sensorReadings={sensorReadings}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </ListPageShell>
  );
}
