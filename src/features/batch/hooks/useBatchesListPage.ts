'use client';

import { useCallback, useMemo } from 'react';
import { useDeleteBatch } from './useDeleteBatch';
import { useBatches } from './useBatches';
import { useListPageState } from '@/shared/hooks/useListPageState';
import { useAlertModal } from '@/shared/components/AlertModal';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import type { Batch, BatchStatusFilter } from '../types';

function sortBatches(batches: Batch[], sortBy: string): Batch[] {
  const list = [...batches];
  switch (sortBy) {
    case 'entryDate':
      return list.sort(
        (a, b) => new Date(b.entryDate ?? 0).getTime() - new Date(a.entryDate ?? 0).getTime(),
      );
    case 'species':
      return list.sort((a, b) => a.species.localeCompare(b.species, 'pt-BR'));
    case 'tankName':
      return list.sort((a, b) => (a.tank?.name ?? '').localeCompare(b.tank?.name ?? '', 'pt-BR'));
    default:
      return list;
  }
}

export function useBatchesListPage() {
  const { user } = useAuthContext();
  const listState = useListPageState<BatchStatusFilter>({
    initialFilter: 'all',
    initialSortBy: 'entryDate',
  });
  const { page, setPage, search, setSearch, filter, setFilter, sortBy, setSortBy } = listState;

  const { data, isLoading, error } = useBatches({
    page,
    limit: 10,
    search,
    companyId: user?.companyId ?? undefined,
  });
  const deleteBatch = useDeleteBatch();
  const { showError } = useAlertModal();

  const filteredBatches = useMemo(() => {
    const list = data?.batches ?? [];
    if (filter === 'active') return list.filter((b) => b.status === 'active');
    if (filter === 'finished') return list.filter((b) => b.status === 'finished');
    return list;
  }, [data?.batches, filter]);

  const sortedBatches = useMemo(
    () => sortBatches(filteredBatches, sortBy),
    [filteredBatches, sortBy],
  );

  const stats = useMemo(
    () => ({
      total: sortedBatches.length,
      finishedCount: (data?.batches ?? []).filter((b) => b.status === 'finished').length,
    }),
    [sortedBatches.length, data?.batches],
  );

  const handleDelete = useCallback(
    (id: string, species: string) => {
      showError(
        'Confirmar Exclusão',
        `Tem certeza que deseja excluir o lote de "${species}"? Esta ação não pode ser desfeita.`,
        'Sim, Excluir',
        () => deleteBatch.mutate(id),
      );
    },
    [showError, deleteBatch],
  );

  return {
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
    filteredBatches: sortedBatches,
    stats,
    handleDelete,
    isDeleting: deleteBatch.isPending,
  };
}
