'use client';

import { useCallback, useMemo, useState } from 'react';
import type { Sale, SaleDialogMode, SaleStatusFilter } from '../types';
import { useSales } from './useSales';
import { useCancelSale } from './useCancelSale';
import { useDeleteSale } from './useDeleteSale';
import { useAlertModal } from '@/shared/components/AlertModal';
import { useListPageState } from '@/shared/hooks/useListPageState';
import { getCalendarDateSortTime } from '@/shared/utils/dateFormat';

function sortSales(list: Sale[], sortBy: string): Sale[] {
  const rows = [...list];
  switch (sortBy) {
    case 'saleDate':
      return rows.sort(
        (a, b) => getCalendarDateSortTime(b.saleDate) - getCalendarDateSortTime(a.saleDate),
      );
    case 'totalRevenue':
      return rows.sort((a, b) => b.totalRevenue - a.totalRevenue);
    default:
      return rows;
  }
}

function computeSummaryStats(sales: Sale[]) {
  const activeSales = sales.filter((s) => s.status?.toLowerCase() !== 'cancelled');
  const received = sales
    .filter((s) => s.status?.toLowerCase() === 'paid')
    .reduce((sum, s) => sum + s.totalRevenue, 0);
  const toReceive = sales
    .filter((s) => ['pending', 'confirmed', 'delivered'].includes(s.status?.toLowerCase()))
    .reduce((sum, s) => sum + s.totalRevenue, 0);
  const overdue = sales
    .filter((s) => s.status?.toLowerCase() === 'overdue')
    .reduce((sum, s) => sum + s.totalRevenue, 0);

  return {
    totalRevenue: activeSales.reduce((sum, s) => sum + s.totalRevenue, 0),
    activeSalesCount: activeSales.length,
    received,
    toReceive,
    overdue,
  };
}

export function useSalesListPage() {
  const listState = useListPageState({ initialSortBy: 'saleDate' });
  const { page, setPage, search, setSearch, sortBy, setSortBy } = listState;
  const [status, setStatus] = useState<SaleStatusFilter>('all');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<SaleDialogMode>('create');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const deleteSale = useDeleteSale();
  const cancelSale = useCancelSale();
  const { showError } = useAlertModal();

  const apiStatus = status === 'all' ? undefined : status;

  const { data, isLoading, error } = useSales({
    page,
    limit: 25,
    search,
    status: apiStatus as 'pending' | 'confirmed' | 'cancelled' | undefined,
  });
  const sales = useMemo(() => data?.sales ?? [], [data?.sales]);
  const sortedSales = useMemo(() => sortSales(sales, sortBy), [sales, sortBy]);
  const summaryStats = useMemo(() => computeSummaryStats(sales), [sales]);

  const openDialog = useCallback((mode: SaleDialogMode, sale?: Sale) => {
    setDialogMode(mode);
    setSelectedSale(sale ?? null);
    setDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
    setSelectedSale(null);
  }, []);

  const handleDeleteSale = useCallback(
    (targetId: string, label: string) => {
      showError(
        'Confirmar exclusão',
        `Tem certeza que deseja excluir a venda "${label}"? Esta ação não pode ser desfeita.`,
        'Sim, excluir',
        () => deleteSale.mutate(targetId),
      );
    },
    [showError, deleteSale],
  );

  const handleCancelSale = useCallback(
    (targetId: string, label: string) => {
      showError(
        'Cancelar venda',
        `Deseja cancelar a venda "${label}"? O status será alterado para cancelado.`,
        'Sim, cancelar',
        () => cancelSale.mutate(targetId),
      );
    },
    [showError, cancelSale],
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
    sales: sortedSales,
    status,
    setStatus,
    summaryStats,
    onDeleteSale: handleDeleteSale,
    isDeletingSale: deleteSale.isPending,
    onCancelSale: handleCancelSale,
    isCancellingSale: cancelSale.isPending,
    dialogOpen,
    dialogMode,
    selectedSale,
    openDialog,
    closeDialog,
  };
}
