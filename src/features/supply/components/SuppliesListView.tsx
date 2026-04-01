'use client';

import { useCallback } from 'react';
import type { Supply, SupplyListResponse } from '../types';
import { SupplyTable } from './SupplyTable';
import { ListHeader, ListPageShell, SearchField, SortButton } from '@/shared/components/list';
import { ProductsIcon } from '@/shared/components/Sidebar/menuIcons';

export type SuppliesListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  sortBy: string;
  setSortBy: (next: string) => void;
  data: SupplyListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  supplies: Supply[];
};

export function SuppliesListView({
  page,
  setPage,
  search,
  setSearch,
  sortBy,
  setSortBy,
  data,
  isLoading,
  error,
  supplies,
}: Readonly<SuppliesListViewProps>) {
  const handleSort = useCallback((next: string) => setSortBy(next), [setSortBy]);

  return (
    <ListPageShell
      listHeader={
        <ListHeader
          icon={<ProductsIcon />}
          title="Produtos"
          subtitle="Relação de produtos/insumos cadastrados"
          ctaHref="/company/supplies/create"
          ctaLabel="Novo produto"
        />
      }
      toolbar={
        <section className="flex flex-wrap items-center gap-3">
          <SearchField value={search} placeholder="Buscar por nome..." onChange={setSearch} />
          <SortButton current={sortBy} onSort={handleSort} value="name" label="Nome" />
        </section>
      }
      total={data?.total ?? 0}
      totalLabelSingular="produto encontrado"
      totalLabelPlural="produtos encontrados"
      isLoading={isLoading}
      error={error}
      errorMessage="Erro ao carregar produtos."
      isEmpty={!isLoading && !error && supplies.length === 0}
      emptyMessage="Nenhum produto encontrado."
      pagination={
        data
          ? {
              page,
              limit: data.limit,
              total: data.total,
              itemLabelPlural: 'produtos',
              onPageChange: setPage,
            }
          : null
      }
    >
      <SupplyTable supplies={supplies} />
    </ListPageShell>
  );
}

