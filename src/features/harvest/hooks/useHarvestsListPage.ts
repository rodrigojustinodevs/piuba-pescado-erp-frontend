'use client';

import { useCallback } from 'react';
import { useHarvests } from './useHarvests';
import { useDeleteHarvest } from './useDeleteHarvest';
import { useListPageState } from '@/shared/hooks/useListPageState';
import { useAlertModal } from '@/shared/components/AlertModal';

const PER_PAGE = 25;

export function useHarvestsListPage() {
  const listState = useListPageState({ initialSortBy: 'createdAt' });
  const { page, setPage, search, setSearch, sortBy, setSortBy } = listState;

  const { data, isLoading, error } = useHarvests({ page, per_page: PER_PAGE });
  const deleteHarvest = useDeleteHarvest();
  const { showError } = useAlertModal();

  const harvests = data?.harvests ?? [];
  const total = data?.total ?? 0;
  const limit = data?.limit ?? PER_PAGE;

  const handleDelete = useCallback(
    (id: string) => {
      showError(
        'Confirmar Exclusão',
        'Tem certeza que deseja excluir esta despesca? Esta ação não pode ser desfeita.',
        'Sim, Excluir',
        () => deleteHarvest.mutate(id),
      );
    },
    [showError, deleteHarvest],
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
    harvests,
    total,
    limit,
    handleDelete,
    isDeleting: deleteHarvest.isPending,
  };
}
