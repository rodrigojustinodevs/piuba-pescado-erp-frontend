'use client';

import { useCallback, useMemo, useState } from 'react';
import type { Purchase, PurchaseCatalogStats } from '../types';
import { usePurchases } from './usePurchases';
import { useDeletePurchase } from './useDeletePurchase';
import { useReceivePurchase } from './useReceivePurchase';
import { useCancelPurchase } from './useCancelPurchase';
import { useAlertModal } from '@/shared/components/AlertModal';
import { useListPageState } from '@/shared/hooks/useListPageState';

type TabFilter = 'todas' | 'pendentes' | 'parcial' | 'pagos';

function sortPurchases(rows: Purchase[], sortBy: string): Purchase[] {
  const list = [...rows];
  switch (sortBy) {
    case 'orderDate':
      return list.sort(
        (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime(),
      );
    case 'supplierName':
      return list.sort((a, b) =>
        (a.supplierName || '').localeCompare(b.supplierName || '', 'pt-BR'),
      );
    case 'totalPrice':
      return list.sort((a, b) => b.totalPrice - a.totalPrice);
    case 'status':
      return list.sort((a, b) => a.status.localeCompare(b.status, 'pt-BR'));
    default:
      return list;
  }
}

function filterPurchases(
  rows: Purchase[],
  search: string,
  statusFilter: string,
  tabFilter: TabFilter,
): Purchase[] {
  let result = rows;

  if (search.trim()) {
    const term = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.supplierName?.toLowerCase().includes(term) ||
        p.invoiceNumber?.toLowerCase().includes(term),
    );
  }

  if (statusFilter) {
    result = result.filter((p) => p.status === statusFilter);
  }

  if (tabFilter === 'pendentes') {
    result = result.filter((p) => p.paymentStatus === 'pending');
  } else if (tabFilter === 'parcial') {
    result = result.filter((p) => p.paymentStatus === 'partial');
  } else if (tabFilter === 'pagos') {
    result = result.filter((p) => p.paymentStatus === 'paid');
  }

  return result;
}

function computeStats(purchases: Purchase[]): PurchaseCatalogStats {
  return {
    totalPurchases: purchases.length,
    pendingCount: purchases.filter((p) => p.status === 'draft' || p.status === 'confirmed').length,
    totalValue: purchases.reduce((sum, p) => sum + (p.totalPrice || 0), 0),
    receivedCount: purchases.filter((p) => p.status === 'received').length,
  };
}

export function usePurchasesListPage() {
  const listState = useListPageState({ initialSortBy: 'orderDate' });
  const { page, setPage, search, setSearch, sortBy, setSortBy } = listState;

  const [statusFilter, setStatusFilter] = useState('');
  const [tabFilter, setTabFilter] = useState<TabFilter>('todas');

  const { data, isLoading, error } = usePurchases({ page, limit: 25, search });
  const deletePurchase = useDeletePurchase();
  const receivePurchase = useReceivePurchase();
  const cancelPurchase = useCancelPurchase();
  const { showError, showSuccess } = useAlertModal();

  const allPurchases = data?.purchases ?? [];
  const stats = useMemo(() => computeStats(allPurchases), [allPurchases]);
  const filtered = useMemo(
    () => filterPurchases(allPurchases, search, statusFilter, tabFilter),
    [allPurchases, search, statusFilter, tabFilter],
  );
  const purchases = useMemo(() => sortPurchases(filtered, sortBy), [filtered, sortBy]);

  const handleDelete = useCallback(
    (targetId: string, label: string) => {
      showError(
        'Confirmar Exclusão',
        `Tem certeza que deseja excluir a compra "${label}"? Esta ação não pode ser desfeita.`,
        'Sim, Excluir',
        () => deletePurchase.mutate(targetId),
      );
    },
    [showError, deletePurchase],
  );

  const handleReceive = useCallback(
    (targetId: string, label: string) => {
      showSuccess(
        'Confirmar Recebimento',
        `Tem certeza que deseja marcar a compra "${label}" como recebida?`,
        'Sim, Receber',
        () => receivePurchase.mutate(targetId),
      );
    },
    [showSuccess, receivePurchase],
  );

  const handleCancel = useCallback(
    (targetId: string, label: string) => {
      showError(
        'Confirmar Cancelamento',
        `Tem certeza que deseja cancelar a compra "${label}"?`,
        'Sim, Cancelar',
        () => cancelPurchase.mutate(targetId),
      );
    },
    [showError, cancelPurchase],
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
    tabFilter,
    setTabFilter,
    data,
    isLoading,
    error,
    purchases,
    stats,
    handleDelete,
    isDeleting: deletePurchase.isPending,
    handleReceive,
    isReceiving: receivePurchase.isPending,
    handleCancel,
    isCancelling: cancelPurchase.isPending,
  };
}
