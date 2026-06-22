'use client';

import { useCallback, useMemo } from 'react';
import { useStockings, type UseStockingsParams } from './useStockings';
import { useDeleteStocking } from './useDeleteStocking';
import { useListPageState } from '@/shared/hooks/useListPageState';
import { useAlertModal } from '@/shared/components/AlertModal';

const PER_PAGE = 25;

export function useStockingsListPage() {
  const listState = useListPageState();
  const { page, setPage, search, setSearch } = listState;
  const { data, isLoading, error } = useStockings({
    page,
    perPage: PER_PAGE,
    search: search.trim() || undefined,
  } satisfies UseStockingsParams);
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

  const stats = useMemo(() => {
    const totalQuantity = stockings.reduce((acc, s) => acc + s.quantity, 0);
    const totalCost = stockings.reduce((acc, s) => acc + s.quantity * s.averageWeight, 0);
    const averageWeight =
      stockings.length > 0
        ? stockings.reduce((acc, s) => acc + s.averageWeight, 0) / stockings.length
        : 0;
    const totalBiomass = totalQuantity * averageWeight;

    return {
      total,
      active: total,
      totalQuantity,
      totalCost,
      totalBiomass,
    };
  }, [stockings, total]);

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
    data,
    isLoading,
    error,
    stockings,
    total,
    limit,
    stats,
    batchMap,
    handleDelete,
    isDeleting: deleteStocking.isPending,
  };
}
