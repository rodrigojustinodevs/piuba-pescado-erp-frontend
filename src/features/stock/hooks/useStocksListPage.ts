'use client';

import { useCallback, useMemo, useState } from 'react';
import type { StockLocation, StockCatalogStats } from '../types';
import { useStocks } from './useStocks';
import { useDeleteStock } from './useDeleteStock';
import { useAlertModal } from '@/shared/components/AlertModal';
import { useListPageState } from '@/shared/hooks/useListPageState';

function filterStocks(
  list: StockLocation[],
  search: string,
  typeFilter: string,
  statusFilter: string,
): StockLocation[] {
  let result = list;
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    result = result.filter(
      (s) =>
        s.code.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q) ||
        (s.responsible ?? '').toLowerCase().includes(q),
    );
  }
  if (typeFilter) {
    result = result.filter((s) => s.type === typeFilter);
  }
  if (statusFilter) {
    result = result.filter((s) => s.status === statusFilter);
  }
  return result;
}

export function useStocksListPage() {
  const listState = useListPageState({ initialSortBy: 'name' });
  const { page, setPage, search, setSearch, sortBy, setSortBy } = listState;
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading, error } = useStocks({ page, limit: 25 });

  const allStocks = useMemo<StockLocation[]>(() => data?.stocks ?? [], [data?.stocks]);

  const stocks = useMemo(
    () => filterStocks(allStocks, search, typeFilter, statusFilter),
    [allStocks, search, typeFilter, statusFilter],
  );

  const stats = useMemo<StockCatalogStats>(
    () => ({
      totalStocks: data?.total ?? allStocks.length,
      activeCount: allStocks.filter((s) => s.status === 'active').length,
      inactiveCount: allStocks.filter((s) => s.status === 'inactive').length,
      totalCapacity: allStocks.reduce((acc, s) => acc + (s.capacity ?? 0), 0),
      totalItems: allStocks.reduce((acc, s) => acc + s.currentQuantity, 0),
    }),
    [data?.total, allStocks],
  );

  const deleteStock = useDeleteStock();
  const { showError } = useAlertModal();

  const handleDelete = useCallback(
    (id: string, label: string) => {
      showError(
        'Confirmar Exclusão',
        `Tem certeza que deseja excluir o local "${label}"? Esta ação não pode ser desfeita.`,
        'Sim, Excluir',
        () => deleteStock.mutate(id),
      );
    },
    [showError, deleteStock],
  );

  return {
    page,
    setPage,
    search,
    setSearch,
    sortBy,
    setSortBy,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    data,
    isLoading,
    error,
    stocks,
    stats,
    handleDelete,
    isDeleting: deleteStock.isPending,
  };
}
