'use client';

import { useCallback } from 'react';
import type { Client, ClientListResponse } from '../types';
import { ClientTable } from './ClientTable';
import { ListHeader, ListPageShell, SearchField, SortButton } from '@/shared/components/list';
import { OrdersIcon } from '@/shared/components/Sidebar/menuIcons';

export type ClientsListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  sortBy: string;
  setSortBy: (next: string) => void;
  data: ClientListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  clients: Client[];
  handleDelete: (id: string, label: string) => void;
  isDeleting: boolean;
};

export function ClientsListView({
  page,
  setPage,
  search,
  setSearch,
  sortBy,
  setSortBy,
  data,
  isLoading,
  error,
  clients,
  handleDelete,
  isDeleting,
}: Readonly<ClientsListViewProps>) {
  const handleSort = useCallback((next: string) => setSortBy(next), [setSortBy]);

  return (
    <ListPageShell
      listHeader={
        <ListHeader
          icon={<OrdersIcon />}
          title="Clientes"
          subtitle="Relação de clientes cadastrados"
          ctaHref="/company/clients/create"
          ctaLabel="Novo cliente"
        />
      }
      toolbar={
        <section className="flex flex-wrap items-center gap-3">
          <SearchField
            value={search}
            placeholder="Buscar por nome, documento, e-mail..."
            onChange={setSearch}
          />
          <SortButton current={sortBy} onSort={handleSort} value="name" label="Nome" />
        </section>
      }
      total={data?.total ?? 0}
      totalLabelSingular="cliente encontrado"
      totalLabelPlural="clientes encontrados"
      isLoading={isLoading}
      error={error}
      errorMessage="Erro ao carregar clientes."
      isEmpty={!isLoading && !error && clients.length === 0}
      emptyMessage="Nenhum cliente encontrado."
      pagination={
        data
          ? {
              page,
              limit: data.limit,
              total: data.total,
              itemLabelPlural: 'clientes',
              onPageChange: setPage,
            }
          : null
      }
    >
      <ClientTable clients={clients} onDelete={handleDelete} isDeleting={isDeleting} />
    </ListPageShell>
  );
}

