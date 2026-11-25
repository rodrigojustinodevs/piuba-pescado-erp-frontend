'use client';

import { useCallback, useMemo, useState } from 'react';
import type { Tank } from '../types';
import { useDeleteTank } from './useDeleteTank';
import { useTanks } from './useTanks';
import { useListPageState, type StatusFilter } from '@/shared/hooks/useListPageState';
import { useAlertModal } from '@/shared/components/AlertModal';

function sortTanks(tanks: Tank[], sortBy: string): Tank[] {
  const list = [...tanks];
  switch (sortBy) {
    case 'name':
      return list.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    case 'createdAt':
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'capacity':
      return list.sort((a, b) => b.capacityLiters - a.capacityLiters);
    default:
      return list;
  }
}

export function useTanksListPage() {
  const listState = useListPageState<StatusFilter>({ initialSortBy: 'name' });
  const { page, setPage, search, setSearch, filter, setFilter, sortBy, setSortBy } = listState;
  const [tankTypeFilter, setTankTypeFilter] = useState<string>('all');

  const { data, isLoading, error } = useTanks({ page, limit: 12, search });
  const deleteTank = useDeleteTank();
  const { showError } = useAlertModal();

  const tanks = useMemo(() => data?.tanks ?? [], [data?.tanks]);

  const tanksByType = useMemo(() => {
    if (tankTypeFilter === 'all') return tanks;
    return tanks.filter((t) => t.tankType?.id === tankTypeFilter);
  }, [tanks, tankTypeFilter]);

  const filteredTanks = useMemo(() => {
    const byStatus =
      filter === 'all' ? tanksByType : tanksByType.filter((t) => t.status === filter);
    return sortTanks(byStatus, sortBy);
  }, [tanksByType, filter, sortBy]);

  const stats = useMemo(() => {
    let active = 0;
    let inactive = 0;
    let maintenance = 0;
    for (const t of tanks) {
      if (t.status === 'active') active++;
      else if (t.status === 'inactive') inactive++;
      else if (t.status === 'maintenance') maintenance++;
    }
    return { total: data?.total ?? 0, active, inactive, maintenance };
  }, [tanks, data?.total]);

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
    tankTypeFilter,
    setTankTypeFilter,
    sortBy,
    setSortBy,
    data,
    isLoading,
    error,
    filteredTanks,
    stats,
    handleDelete,
    isDeleting: deleteTank.isPending,
  };
}
