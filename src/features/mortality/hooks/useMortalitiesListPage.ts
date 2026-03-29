'use client';

import { useCallback, useMemo } from 'react';
import type { Mortality } from '../types';
import { useMortalities } from './useMortalities';
import { useDeleteMortality } from './useDeleteMortality';
import { useListPageState } from '@/shared/hooks/useListPageState';
import { useAlertModal } from '@/shared/components/AlertModal';

function sortMortalities(mortalities: Mortality[], sortBy: string): Mortality[] {
  const list = [...mortalities];
  switch (sortBy) {
    case 'mortalityDate':
      return list.sort(
        (a, b) => new Date(b.mortalityDate).getTime() - new Date(a.mortalityDate).getTime(),
      );
    case 'batchName':
      return list.sort((a, b) => a.batchName.localeCompare(b.batchName, 'pt-BR'));
    case 'quantity':
      return list.sort((a, b) => b.quantity - a.quantity);
    default:
      return list;
  }
}

export function useMortalitiesListPage() {
  const listState = useListPageState({ initialSortBy: 'mortalityDate' });
  const { page, setPage, search, setSearch, sortBy, setSortBy } = listState;

  const { data, isLoading, error } = useMortalities({ page, limit: 25, search });
  const deleteMortality = useDeleteMortality();
  const { showError } = useAlertModal();

  const mortalities = data?.mortalities ?? [];
  const sortedMortalities = useMemo(
    () => sortMortalities(mortalities, sortBy),
    [mortalities, sortBy],
  );

  const handleDelete = useCallback(
    (id: string, label: string) => {
      showError(
        'Confirmar Exclusão',
        `Tem certeza que deseja excluir o registro "${label}"? Esta ação não pode ser desfeita.`,
        'Sim, Excluir',
        () => deleteMortality.mutate(id),
      );
    },
    [showError, deleteMortality],
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
    mortalities: sortedMortalities,
    handleDelete,
    isDeleting: deleteMortality.isPending,
  };
}
