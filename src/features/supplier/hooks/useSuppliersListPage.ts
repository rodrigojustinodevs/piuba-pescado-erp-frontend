'use client';

import { useCallback, useMemo } from 'react';
import type { Supplier } from '../types';
import { useSuppliers } from './useSuppliers';
import { useDeleteSupplier } from './useDeleteSupplier';
import { useAlertModal } from '@/shared/components/AlertModal';
import { useListPageState } from '@/shared/hooks/useListPageState';

function sortSuppliers(list: Supplier[], sortBy: string): Supplier[] {
  const rows = [...list];
  switch (sortBy) {
    case 'name':
      return rows.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'pt-BR'));
    case 'companyName':
      return rows.sort((a, b) => (a.companyName || '').localeCompare(b.companyName || '', 'pt-BR'));
    case 'updatedAt':
      return rows.sort(
        (a, b) =>
          new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime(),
      );
    default:
      return rows;
  }
}

export function useSuppliersListPage() {
  const listState = useListPageState({ initialSortBy: 'name' });
  const { page, setPage, search, setSearch, sortBy, setSortBy } = listState;

  const { data, isLoading, error } = useSuppliers({ page, limit: 25, search });
  const deleteSupplier = useDeleteSupplier();
  const { showError } = useAlertModal();
  const suppliers = data?.suppliers ?? [];
  const sortedSuppliers = useMemo(() => sortSuppliers(suppliers, sortBy), [suppliers, sortBy]);

  const handleDelete = useCallback(
    (targetId: string, label: string) => {
      showError(
        'Confirmar Exclusão',
        `Tem certeza que deseja excluir o fornecedor "${label}"? Esta ação não pode ser desfeita.`,
        'Sim, Excluir',
        () => deleteSupplier.mutate(targetId),
      );
    },
    [showError, deleteSupplier],
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
    suppliers: sortedSuppliers,
    handleDelete,
    isDeleting: deleteSupplier.isPending,
  };
}
