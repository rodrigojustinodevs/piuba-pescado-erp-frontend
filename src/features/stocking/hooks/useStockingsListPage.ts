'use client';

import { useCallback, useMemo } from 'react';
import { useStockings } from './useStockings';
import { useDeleteStocking } from './useDeleteStocking';
import { useListPageState } from '@/shared/hooks/useListPageState';
import { useAlertModal } from '@/shared/components/AlertModal';

const PER_PAGE = 25;

export function useStockingsListPage() {
  const listState = useListPageState({ initialSortBy: 'stockingDate' });
  const { page, setPage, search, setSearch, sortBy, setSortBy } = listState;

  const { data, isLoading, error } = useStockings({ page, per_page: PER_PAGE });
  const deleteStocking = useDeleteStocking();
  const { showError } = useAlertModal();

  const stockings = data?.stockings ?? [];

  /** Mapa batchId -> label derivado da própria listagem (API já retorna batch em cada item) */
  const batchMap = useMemo(() => {
    const map: Record<string, string> = {};
    stockings.forEach((s) => {
      if (s.batchId) map[s.batchId] = s.batchName ?? s.batchId.slice(0, 8) + '…';
    });
    return map;
  }, [stockings]);

  const total = data?.total ?? 0;
  const limit = data?.limit ?? PER_PAGE;

  const handleDelete = useCallback(
    (id: string, label: string) => {
      showError(
        'Confirmar Exclusão',
        `Tem certeza que deseja excluir o povoamento "${label}"? Esta ação não pode ser desfeita.`,
        'Sim, Excluir',
        () => deleteStocking.mutate(id),
      );
    },
    [showError, deleteStocking],
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
    stockings,
    total,
    limit,
    batchMap,
    handleDelete,
    isDeleting: deleteStocking.isPending,
  };
}
