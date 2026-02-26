'use client';

import { useCallback, useMemo } from 'react';
import { useDeleteBatch } from './useDeleteBatch';
import { useBatches } from './useBatches';
import { useListPageState } from '@/shared/hooks/useListPageState';
import { useAlertModal } from '@/shared/components/AlertModal';
import type { BatchStatus } from '../types';

export type BatchStatusFilter = 'all' | BatchStatus;

export function useBatchesListPage() {
  const listState = useListPageState<BatchStatusFilter>({ initialFilter: 'all' });
  const { page, setPage, search, setSearch, filter, setFilter, sortBy, setSortBy } = listState;

  const { data, isLoading, error } = useBatches({ page, limit: 10, search });
  const deleteBatch = useDeleteBatch();
  const { showError } = useAlertModal();

  const filteredBatches = useMemo(() => {
    const list = data?.batches ?? [];
    if (filter === 'active') return list.filter((b) => b.status === 'active');
    if (filter === 'finished') return list.filter((b) => b.status === 'finished');
    return list;
  }, [data?.batches, filter]);

  const stats = useMemo(
    () => ({
      total: filteredBatches.length,
      finishedCount: (data?.batches ?? []).filter((b) => b.status === 'finished').length,
    }),
    [filteredBatches.length, data?.batches],
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
    filteredBatches,
    stats,
    handleDelete,
    isDeleting: deleteBatch.isPending,
  };
}
