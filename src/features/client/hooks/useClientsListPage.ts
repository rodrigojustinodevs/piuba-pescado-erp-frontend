'use client';

import { useCallback, useMemo } from 'react';
import type { Client } from '../types';
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

export function useClientsListPage() {
  const listState = useListPageState({ initialSortBy: 'name' });
  const { page, setPage, search, setSearch, sortBy, setSortBy } = listState;

  const { data, isLoading, error } = useClients({ page, limit: 25, search });
  const deleteClient = useDeleteClient();
  const { showError } = useAlertModal();
  const clients = useMemo(() => data?.clients ?? [], [data?.clients]);
  const sortedClients = useMemo(() => sortClients(clients, sortBy), [clients, sortBy]);

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
    data,
    isLoading,
    error,
    clients: sortedClients,
    handleDelete,
    isDeleting: deleteClient.isPending,
  };
}

