'use client';

import { useCallback, useMemo, useState } from 'react';
import type { Sale } from '../types';
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

export function useSalesListPage() {
  const listState = useListPageState({ initialSortBy: 'saleDate' });
  const { page, setPage, search, setSearch, sortBy, setSortBy } = listState;
  const [status, setStatus] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const deleteSale = useDeleteSale();
  const cancelSale = useCancelSale();
  const { showError } = useAlertModal();

  const { data, isLoading, error } = useSales({
    page,
    limit: 25,
    search,
    status: status === 'all' ? undefined : status,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });
  const sales = useMemo(() => data?.sales ?? [], [data?.sales]);
  const sortedSales = useMemo(() => sortSales(sales, sortBy), [sales, sortBy]);

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
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    onDeleteSale: handleDeleteSale,
    isDeletingSale: deleteSale.isPending,
    onCancelSale: handleCancelSale,
    isCancellingSale: cancelSale.isPending,
  };
}
