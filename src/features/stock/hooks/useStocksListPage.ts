'use client';

import { useCallback, useMemo, useState } from 'react';
import type { Stock } from '../types';
import { useStocks } from './useStocks';
import { useDeleteStock } from './useDeleteStock';
import { useAdjustStock } from './useAdjustStock';
import { useAlertModal } from '@/shared/components/AlertModal';
import { useListPageState } from '@/shared/hooks/useListPageState';

function sortStocks(list: Stock[], sortBy: string): Stock[] {
  const rows = [...list];
  switch (sortBy) {
    case 'supplyName':
      return rows.sort((a, b) => (a.supplyName || '').localeCompare(b.supplyName || '', 'pt-BR'));
    case 'currentQuantity':
      return rows.sort((a, b) => b.currentQuantity - a.currentQuantity);
    case 'updatedAt':
      return rows.sort(
        (a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime(),
      );
    default:
      return rows;
  }
}

export function useStocksListPage() {
  const listState = useListPageState({ initialSortBy: 'updatedAt' });
  const { page, setPage, search, setSearch, sortBy, setSortBy } = listState;

  const { data, isLoading, error } = useStocks({ page, limit: 25, search });
  const deleteStock = useDeleteStock();
  const adjustStock = useAdjustStock();
  const { showError } = useAlertModal();
  const stocks = useMemo(() => data?.stocks ?? [], [data?.stocks]);
  const sortedStocks = useMemo(() => sortStocks(stocks, sortBy), [stocks, sortBy]);
  const [adjustTarget, setAdjustTarget] = useState<{ id: string; label: string } | null>(null);

  const handleDelete = useCallback(
    (targetId: string, label: string) => {
      showError(
        'Confirmar Exclusão',
        `Tem certeza que deseja excluir o estoque "${label}"? Esta ação não pode ser desfeita.`,
        'Sim, Excluir',
        () => deleteStock.mutate(targetId),
      );
    },
    [showError, deleteStock],
  );

  const openAdjust = useCallback((id: string, label: string) => {
    setAdjustTarget({ id, label });
  }, []);

  const closeAdjust = useCallback(() => setAdjustTarget(null), []);

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
    stocks: sortedStocks,
    handleDelete,
    isDeleting: deleteStock.isPending,
    openAdjust,
    closeAdjust,
    adjustTarget,
    adjustStock,
  };
}
