'use client';

import { useCallback, useMemo, useState } from 'react';
import type { Client, ClientCatalogStats } from '../types';
import { useClients } from './useClients';
import { useDeleteClient } from './useDeleteClient';
import { useAlertModal } from '@/shared/components/AlertModal';
import { useListPageState } from '@/shared/hooks/useListPageState';

function sortClients(list: Client[], sortBy: string): Client[] {
  const rows = [...list];
  switch (sortBy) {
    case 'name':
      return rows.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'pt-BR'));
    case 'updatedAt':
      return rows.sort(
        (a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime(),
      );
    default:
      return rows;
  }
}

function filterClients(
  list: Client[],
  search: string,
  statusFilter: string,
  segmentFilter: string,
): Client[] {
  let result = list;
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.documentNumber ?? '').toLowerCase().includes(q) ||
        (c.contact ?? '').toLowerCase().includes(q) ||
        (c.email ?? '').toLowerCase().includes(q) ||
        (c.phone ?? '').toLowerCase().includes(q),
    );
  }
  if (statusFilter) {
    result = result.filter((c) => c.status === statusFilter);
  }
  if (segmentFilter) {
    result = result.filter((c) => c.priceGroup === segmentFilter);
  }
  return result;
}

export function useClientsListPage() {
  const listState = useListPageState({ initialSortBy: 'name' });
  const { page, setPage, search, setSearch, sortBy, setSortBy } = listState;
  const [statusFilter, setStatusFilter] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('');

  const { data, isLoading, error } = useClients({ page, limit: 25, search: '' });
  const deleteClient = useDeleteClient();
  const { showError } = useAlertModal();

  const clients = useMemo(() => data?.clients ?? [], [data?.clients]);

  const filtered = useMemo(
    () => filterClients(sortClients(clients, sortBy), search, statusFilter, segmentFilter),
    [clients, sortBy, search, statusFilter, segmentFilter],
  );

  const stats = useMemo<ClientCatalogStats>(
    () => ({
      total: data?.total ?? 0,
      activeCount: clients.filter((c) => c.status === 'active').length,
      prospectCount: clients.filter((c) => c.status === 'prospect').length,
      totalCreditLimit: clients.reduce((acc, c) => {
        const v = Number.parseFloat(c.creditLimit ?? '0');
        return acc + (Number.isNaN(v) ? 0 : v);
      }, 0),
    }),
    [data?.total, clients],
  );

  const handleDelete = useCallback(
    (targetId: string, label: string) => {
      showError(
        'Confirmar Exclusão',
        `Tem certeza que deseja excluir o cliente "${label}"? Esta ação não pode ser desfeita.`,
        'Sim, Excluir',
        () => deleteClient.mutate(targetId),
      );
    },
    [showError, deleteClient],
  );

  return {
    page,
    setPage,
    search,
    setSearch,
    sortBy,
    setSortBy,
    statusFilter,
    setStatusFilter,
    segmentFilter,
    setSegmentFilter,
    data,
    isLoading,
    error,
    clients: filtered,
    stats,
    handleDelete,
    isDeleting: deleteClient.isPending,
  };
}
