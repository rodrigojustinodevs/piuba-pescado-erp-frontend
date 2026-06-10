'use client';

import { useCallback, useMemo } from 'react';
import type { Feeding } from '../types';
import { useFeedings } from './useFeedings';
import { useDeleteFeeding } from './useDeleteFeeding';
import { useListPageState } from '@/shared/hooks/useListPageState';
import { useAlertModal } from '@/shared/components/AlertModal';

function sortFeedings(feedings: Feeding[], sortBy: string): Feeding[] {
  const list = [...feedings];
  switch (sortBy) {
    case 'feedingDate':
      return list.sort(
        (a, b) => new Date(b.feedingDate).getTime() - new Date(a.feedingDate).getTime(),
      );
    case 'batchName':
      return list.sort((a, b) => (a.batch.name || '').localeCompare(b.batch.name || '', 'pt-BR'));
    case 'quantityProvided':
      return list.sort((a, b) => b.quantityProvided - a.quantityProvided);
    default:
      return list;
  }
}

export function useFeedingsListPage() {
  const listState = useListPageState({ initialSortBy: 'feedingDate' });
  const { page, setPage, search, setSearch, sortBy, setSortBy } = listState;

  const { data, isLoading, error } = useFeedings({ page, limit: 25, search });

  const deleteFeeding = useDeleteFeeding();
  const { showError } = useAlertModal();

  const feedings = data?.feedings ?? [];
  const sortedFeedings = useMemo(() => sortFeedings(feedings, sortBy), [feedings, sortBy]);

  const handleDelete = useCallback(
    (id: string, label: string) => {
      showError(
        'Confirmar Exclusão',
        `Tem certeza que deseja excluir a alimentação "${label}"? Esta ação não pode ser desfeita.`,
        'Sim, Excluir',
        () => deleteFeeding.mutate(id),
      );
    },
    [showError, deleteFeeding],
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
    feedings: sortedFeedings,
    handleDelete,
    isDeleting: deleteFeeding.isPending,
  };
}
