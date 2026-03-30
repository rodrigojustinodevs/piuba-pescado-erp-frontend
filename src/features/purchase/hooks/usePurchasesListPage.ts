'use client';

import { useCallback, useMemo } from 'react';
import type { Purchase } from '../types';
import { usePurchases } from './usePurchases';
import { useDeletePurchase } from './useDeletePurchase';
import { useReceivePurchase } from './useReceivePurchase';
import { useCancelPurchase } from './useCancelPurchase';
import { useAlertModal } from '@/shared/components/AlertModal';
import { useListPageState } from '@/shared/hooks/useListPageState';

function sortPurchases(rows: Purchase[], sortBy: string): Purchase[] {
  const list = [...rows];
  switch (sortBy) {
    case 'purchaseDate':
      return list.sort(
        (a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime(),
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

export function usePurchasesListPage() {
  const listState = useListPageState({ initialSortBy: 'purchaseDate' });
  const { page, setPage, search, setSearch, sortBy, setSortBy } = listState;

  const { data, isLoading, error } = usePurchases({ page, limit: 25, search });
  const deletePurchase = useDeletePurchase();
  const receivePurchase = useReceivePurchase();
  const cancelPurchase = useCancelPurchase();
  const { showError, showSuccess } = useAlertModal();

  const purchases = data?.purchases ?? [];
  const sorted = useMemo(() => sortPurchases(purchases, sortBy), [purchases, sortBy]);

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
    data,
    isLoading,
    error,
    purchases: sorted,
    handleDelete,
    isDeleting: deletePurchase.isPending,
    handleReceive,
    isReceiving: receivePurchase.isPending,
    handleCancel,
    isCancelling: cancelPurchase.isPending,
  };
}
