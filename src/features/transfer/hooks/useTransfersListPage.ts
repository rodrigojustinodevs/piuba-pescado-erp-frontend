'use client';

import { useCallback } from 'react';
import { useTransfers } from './useTransfers';
import { useDeleteTransfer } from './useDeleteTransfer';
import { useListPageState } from '@/shared/hooks/useListPageState';
import { useAlertModal } from '@/shared/components/AlertModal';

const PER_PAGE = 25;

export function useTransfersListPage() {
  const listState = useListPageState({ initialSortBy: 'createdAt' });
  const { page, setPage, search, setSearch, sortBy, setSortBy } = listState;

  const { data, isLoading, error } = useTransfers({ page, per_page: PER_PAGE });
  const deleteTransfer = useDeleteTransfer();
  const { showError } = useAlertModal();

  const transfers = data?.transfers ?? [];
  const total = data?.total ?? 0;
  const limit = data?.limit ?? PER_PAGE;

  const handleDelete = useCallback(
    (id: string) => {
      showError(
        'Confirmar Exclusão',
        'Tem certeza que deseja excluir esta transferência? Esta ação não pode ser desfeita.',
        'Sim, Excluir',
        () => deleteTransfer.mutate(id),
      );
    },
    [showError, deleteTransfer],
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
    transfers,
    total,
    limit,
    handleDelete,
    isDeleting: deleteTransfer.isPending,
  };
}
