'use client';

import { useCallback } from 'react';
import type { Supplier, SupplierListResponse } from '../types';
import { SupplierTable } from './SupplierTable';
import { ListHeader, ListPageShell, SearchField, SortButton } from '@/shared/components/list';
import { BuildingIcon } from '@/shared/components/Sidebar/menuIcons';

export type SuppliersListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  sortBy: string;
  setSortBy: (next: string) => void;
  data: SupplierListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  suppliers: Supplier[];
  handleDelete: (id: string, label: string) => void;
  isDeleting: boolean;
};

export function SuppliersListView({
  page,
  setPage,
  search,
  setSearch,
  sortBy,
  setSortBy,
  data,
  isLoading,
  error,
  suppliers,
  handleDelete,
  isDeleting,
}: Readonly<SuppliersListViewProps>) {
  const handleSort = useCallback((next: string) => setSortBy(next), [setSortBy]);

  return (
    <ListPageShell
      listHeader={
        <ListHeader
          icon={<BuildingIcon />}
          title="Fornecedores"
          subtitle="Relação de fornecedores da empresa"
          ctaHref="/company/suppliers/create"
          ctaLabel="Novo fornecedor"
        />
      }
      toolbar={
        <section className="flex flex-wrap items-center gap-3">
          <SearchField
            value={search}
            placeholder="Buscar por nome, contato ou e-mail..."
            onChange={setSearch}
          />
          <SortButton current={sortBy} onSort={handleSort} value="name" label="Nome" />
        </section>
      }
      total={data?.total ?? 0}
      totalLabelSingular="fornecedor encontrado"
      totalLabelPlural="fornecedores encontrados"
      isLoading={isLoading}
      error={error}
      errorMessage="Erro ao carregar fornecedores."
      isEmpty={!isLoading && !error && suppliers.length === 0}
      emptyMessage="Nenhum fornecedor encontrado."
      pagination={
        data
          ? {
              page,
              limit: data.limit,
              total: data.total,
              itemLabelPlural: 'fornecedores',
              onPageChange: setPage,
            }
          : null
      }
    >
      <SupplierTable suppliers={suppliers} onDelete={handleDelete} isDeleting={isDeleting} />
    </ListPageShell>
  );
}
