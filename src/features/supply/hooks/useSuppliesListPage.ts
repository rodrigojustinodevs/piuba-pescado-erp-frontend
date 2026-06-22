'use client';

import { useCallback, useMemo, useState } from 'react';
import type { Supply, SupplyCatalogStats } from '../types';
import { useSupplies } from './useSupplies';
import { useDeleteSupply } from './useDeleteSupply';
import { useListPageState } from '@/shared/hooks/useListPageState';
import { useAlertModal } from '@/shared/components/AlertModal';

function sortSupplies(list: Supply[], sortBy: string): Supply[] {
  const rows = [...list];
  switch (sortBy) {
    case 'name':
      return rows.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    case 'updatedAt':
      return rows.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
    default:
      return rows;
  }
}

function filterSupplies(
  list: Supply[],
  search: string,
  categoryFilter: string,
  statusFilter: string,
  typeFilter: string,
): Supply[] {
  let result = list;
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    result = result.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.category ?? '').toLowerCase().includes(q) ||
        (s.supplierName ?? '').toLowerCase().includes(q) ||
        (s.sku ?? '').toLowerCase().includes(q),
    );
  }
  if (categoryFilter) {
    result = result.filter((s) => s.category === categoryFilter);
  }
  if (statusFilter) {
    result = result.filter((s) => s.status === statusFilter);
  }
  if (typeFilter === 'insumos') {
    result = result.filter((s) => !s.isProduct);
  } else if (typeFilter === 'produtos') {
    result = result.filter((s) => s.isProduct);
  }
  return result;
}

export function useSuppliesListPage() {
  const listState = useListPageState({ initialSortBy: 'name' });
  const { page, setPage, search, setSearch, sortBy, setSortBy } = listState;
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('todos');

  const { data, isLoading, error } = useSupplies({ page, limit: 25, search: '' });

  const supplies = useMemo(() => data?.supplies ?? [], [data?.supplies]);

  const categories = useMemo(() => {
    const cats = new Set(supplies.map((s) => s.category).filter(Boolean) as string[]);
    return Array.from(cats).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [supplies]);

  const filtered = useMemo(
    () => filterSupplies(sortSupplies(supplies, sortBy), search, categoryFilter, statusFilter, typeFilter),
    [supplies, sortBy, search, categoryFilter, statusFilter, typeFilter],
  );

  const stats = useMemo<SupplyCatalogStats>(() => ({
    totalItems: data?.total ?? 0,
    belowMinimumCount: supplies.filter((s) => s.currentStock < s.minStock && s.minStock > 0).length,
    totalStockValue: supplies.reduce((acc, s) => acc + s.currentStock * s.unitCost, 0),
  }), [data?.total, supplies]);

  const deleteSupply = useDeleteSupply();
  const { showError } = useAlertModal();

  const handleDelete = useCallback(
    (id: string) => {
      showError(
        'Confirmar Exclusão',
        'Tem certeza que deseja excluir este produto?',
        'Sim, Excluir',
        () => deleteSupply.mutate(id),
      );
    },
    [showError, deleteSupply],
  );

  return {
    page,
    setPage,
    search,
    setSearch,
    sortBy,
    setSortBy,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    data,
    isLoading,
    error,
    supplies: filtered,
    categories,
    stats,
    handleDelete,
    isDeleting: deleteSupply.isPending,
  };
}
