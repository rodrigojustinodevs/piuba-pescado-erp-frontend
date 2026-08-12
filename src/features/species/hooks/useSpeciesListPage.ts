'use client';

import { useCallback } from 'react';
import { useDeleteSpecies } from './useDeleteSpecies';
import { useSpeciesList } from './useSpeciesList';
import { useListPageState } from '@/shared/hooks/useListPageState';
import { useAlertModal } from '@/shared/components/AlertModal';

export function useSpeciesListPage() {
  const listState = useListPageState({ initialSortBy: 'name' });
  const { page, setPage, search, setSearch, sortBy, setSortBy } = listState;

  const { data, isLoading, error } = useSpeciesList({ page, limit: 10, search });
  const deleteSpecies = useDeleteSpecies();
  const { showError } = useAlertModal();

  const handleDelete = useCallback(
    (id: string, name: string) => {
      showError(
        'Confirmar Exclusão',
        `Tem certeza que deseja excluir a espécie "${name}"? Esta ação não pode ser desfeita.`,
        'Sim, Excluir',
        () => deleteSpecies.mutate(id),
      );
    },
    [showError, deleteSpecies],
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
    handleDelete,
    isDeleting: deleteSpecies.isPending,
  };
}
