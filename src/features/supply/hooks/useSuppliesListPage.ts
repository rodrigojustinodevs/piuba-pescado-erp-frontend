'use client';

import { useMemo } from 'react';
import type { Supply } from '../types';
import { useSupplies } from './useSupplies';
import { useListPageState } from '@/shared/hooks/useListPageState';

function sortSupplies(list: Supply[], sortBy: string): Supply[] {
  const rows = [...list];
  switch (sortBy) {
    case 'name':
      return rows.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'pt-BR'));
    case 'updatedAt':
      return rows.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
    default:
      return rows;
  }
}

export function useSuppliesListPage() {
  const listState = useListPageState({ initialSortBy: 'name' });
  const { page, setPage, search, setSearch, sortBy, setSortBy } = listState;

  const { data, isLoading, error } = useSupplies({ page, limit: 25, search });
  const supplies = useMemo(() => data?.supplies ?? [], [data?.supplies]);
  const sortedSupplies = useMemo(() => sortSupplies(supplies, sortBy), [supplies, sortBy]);

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
    supplies: sortedSupplies,
  };
}

