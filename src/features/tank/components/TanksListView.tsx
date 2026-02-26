'use client';

import { useCallback } from 'react';
import type { Tank, TankListResponse } from '../types';
import { TankTable } from './TankTable';
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

type TankFilter = 'all' | 'active' | 'inactive';

export type TanksListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  filter: TankFilter;
  setFilter: (next: TankFilter) => void;
  sortBy: string;
  setSortBy: (next: string) => void;
  data: TankListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  filteredTanks: Tank[];
  stats: {
    total: number;
    inactive: number;
  };
  handleDelete: (id: string, name: string) => void;
  isDeleting: boolean;
  tankTypeMap: Record<string, string>;
  companyMap: Record<string, string>;
};

export function TanksListView({
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
  filteredTanks,
  stats,
  handleDelete,
  isDeleting,
  tankTypeMap,
  companyMap,
}: Readonly<TanksListViewProps>) {
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
      return <div className="p-8 text-center text-red-600">Erro ao carregar tanques.</div>;
    }

    if (!filteredTanks.length) {
      return <div className="p-8 text-center text-slate-500">Nenhum tanque encontrado.</div>;
    }

    return (
      <>
        <TankTable
          tanks={filteredTanks}
          onDelete={handleDelete}
          isDeleting={isDeleting}
          tankTypeMap={tankTypeMap}
          companyMap={companyMap}
        />

        {data && data.total > data.limit && (
          <Pagination
            page={page}
            limit={data.limit}
            total={data.total}
            itemLabelPlural="tanques"
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
        title="Tanques"
        subtitle="Gerencie e acompanhe os tanques cadastrados"
        ctaHref="/company/tanks/create"
        ctaLabel="Novo Tanque"
      />

      <section className="flex flex-wrap items-center gap-3">
        <SearchField value={search} placeholder="Buscar tanque..." onChange={setSearch} />

        <StatusFilterTabs
          filter={filter}
          onChange={setFilter}
          inactiveCount={stats.inactive}
          labels={{ all: 'Todas', active: 'Ativos', inactive: 'Inativos' }}
        />

        <SortButton current={sortBy} onSort={handleSort} />
      </section>

      <section className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {stats.total} {stats.total === 1 ? 'tanque encontrado' : 'tanques encontrados'}
        </p>
        <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">
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
