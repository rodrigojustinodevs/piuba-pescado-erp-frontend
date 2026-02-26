'use client';

import { useCallback, useMemo } from 'react';
import { useDeleteTank } from './useDeleteTank';
import { useTanks } from './useTanks';
import { useTankLookups } from './useTankLookups';
import { useListPageState, type StatusFilter } from '@/shared/hooks/useListPageState';
import { useAlertModal } from '@/shared/components/AlertModal';

export function useTanksListPage() {
  const listState = useListPageState<StatusFilter>({ initialSortBy: 'name' });
  const { page, setPage, search, setSearch, filter, setFilter, sortBy, setSortBy } = listState;

  const { data, isLoading, error } = useTanks({ page, limit: 10, search });
  const { tankTypeMap = {}, companyMap = {} } = useTankLookups();
  const deleteTank = useDeleteTank();
  const { showError } = useAlertModal();

  const filteredTanks = useMemo(() => {
    const list = data?.tanks ?? [];
    if (filter === 'active') return list.filter((t) => t.status === 'active');
    if (filter === 'inactive') return list.filter((t) => t.status !== 'active');
    return list;
  }, [data?.tanks, filter]);

  const stats = useMemo(
    () => ({
      total: filteredTanks.length,
      inactive: (data?.tanks ?? []).filter((t) => t.status !== 'active').length,
    }),
    [filteredTanks.length, data?.tanks],
  );

  const handleDelete = useCallback(
    (id: string, name: string) => {
      showError(
        'Confirmar Exclusão',
        `Tem certeza que deseja excluir o tanque "${name}"? Esta ação não pode ser desfeita.`,
        'Sim, Excluir',
        () => deleteTank.mutate(id),
      );
    },
    [showError, deleteTank],
  );

  return {
    page,
    setPage,
    search,
    setSearch,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    data,
    isLoading,
    error,
    filteredTanks,
    stats,
    handleDelete,
    isDeleting: deleteTank.isPending,
    tankTypeMap,
    companyMap,
  };
}
