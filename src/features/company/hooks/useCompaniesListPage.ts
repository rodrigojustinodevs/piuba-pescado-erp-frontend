'use client';

import { useCallback, useMemo } from 'react';
import { useDeleteCompany } from './useDeleteCompany';
import { useCompanies } from './useCompanies';
import { useListPageState } from '@/shared/hooks/useListPageState';
import { useAlertModal } from '@/shared/components/AlertModal';

export function useCompaniesListPage() {
  const listState = useListPageState({ initialSortBy: 'name' });
  const { page, setPage, search, setSearch, filter, setFilter } = listState;

  const { data, isLoading, error } = useCompanies({ page, limit: 6, search });
  const deleteCompany = useDeleteCompany();
  const { showError } = useAlertModal();

  const filteredCompanies = useMemo(() => {
    const list = data?.companies ?? [];
    if (filter === 'active') return list.filter((c) => c.active);
    if (filter === 'inactive') return list.filter((c) => !c.active);
    return list;
  }, [data?.companies, filter]);

  const stats = useMemo(
    () => ({
      total: filteredCompanies.length,
      inactive: data?.companies.filter((c) => !c.active).length ?? 0,
    }),
    [filteredCompanies.length, data?.companies],
  );

  const handleDelete = useCallback(
    (id: string, name: string) => {
      showError(
        'Confirmar Exclusão',
        `Tem certeza que deseja excluir a empresa "${name}"? Esta ação não pode ser desfeita.`,
        'Sim, Excluir',
        () => deleteCompany.mutate(id),
      );
    },
    [showError, deleteCompany],
  );

  return {
    page,
    setPage,
    search,
    setSearch,
    filter,
    setFilter,
    data,
    isLoading,
    error,
    filteredCompanies,
    stats,
    handleDelete,
  };
}
