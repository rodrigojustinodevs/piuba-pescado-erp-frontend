'use client';

import { useCallback } from 'react';
import type { WaterQuality, WaterQualityListResponse } from '../types';
import { WaterQualityTable } from './WaterQualityTable';
import { ListHeader, ListPageShell, SearchField, SortButton } from '@/shared/components/list';
import { WaterQualityDropletIcon } from '@/shared/components/icons/FeatureEntityIcons';

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

  return (
    <ListPageShell
      listHeader={
        <ListHeader
          icon={<WaterQualityDropletIcon />}
          title="Qualidade da água"
          subtitle="Medições de pH, oxigênio, temperatura e amônia por tanque"
          ctaHref="/company/water-qualities/create"
          ctaLabel="Nova medição"
        />
      }
      toolbar={
        <section className="flex flex-wrap items-center gap-3">
          <SearchField value={search} placeholder="Buscar por tanque..." onChange={setSearch} />
          <SortButton current={sortBy} onSort={handleSort} value="measuredAt" label="Data" />
        </section>
      }
      total={data?.total ?? 0}
      totalLabelSingular="registro encontrado"
      totalLabelPlural="registros encontrados"
      isLoading={isLoading}
      error={error}
      errorMessage="Erro ao carregar qualidade da água."
      isEmpty={!isLoading && !error && waterQualities.length === 0}
      emptyMessage="Nenhum registro encontrado."
      pagination={
        data
          ? {
              page,
              limit: data.limit,
              total: data.total,
              itemLabelPlural: 'registros',
              onPageChange: setPage,
            }
          : null
      }
    >
      <WaterQualityTable
        waterQualities={waterQualities}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </ListPageShell>
  );
}
