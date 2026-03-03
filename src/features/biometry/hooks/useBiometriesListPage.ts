'use client';

import { useBiometries } from './useBiometries';
import { useListPageState } from '@/shared/hooks/useListPageState';

export function useBiometriesListPage() {
  const listState = useListPageState({ initialSortBy: 'biometryDate' });
  const { page, setPage, search, setSearch } = listState;

  const { data, isLoading, error } = useBiometries({ page, limit: 15, search });

  return {
    page,
    setPage,
    search,
    setSearch,
    data,
    isLoading,
    error,
    biometries: data?.biometries ?? [],
  };
}
