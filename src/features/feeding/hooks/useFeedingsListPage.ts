'use client';

import { useMemo } from 'react';
import type { Feeding } from '../types';
import { useFeedings } from './useFeedings';
import { useListPageState } from '@/shared/hooks/useListPageState';

function sortFeedings(feedings: Feeding[], sortBy: string): Feeding[] {
  const list = [...feedings];
  switch (sortBy) {
    case 'feedingDate':
      return list.sort(
        (a, b) => new Date(b.feedingDate).getTime() - new Date(a.feedingDate).getTime(),
      );
    case 'batchName':
      return list.sort((a, b) => (a.batchName || '').localeCompare(b.batchName || '', 'pt-BR'));
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

  const feedings = data?.feedings ?? [];
  const sortedFeedings = useMemo(() => sortFeedings(feedings, sortBy), [feedings, sortBy]);

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
  };
}
