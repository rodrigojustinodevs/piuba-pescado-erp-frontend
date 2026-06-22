'use client';

import { useCallback, useMemo, useState } from 'react';
import type { Supplier, SupplierStatus } from '../types';
import { useSuppliers } from './useSuppliers';
import { useDeleteSupplier } from './useDeleteSupplier';
import { useSupplierPurchaseStats } from './useSupplierPurchaseStats';
import { useAlertModal } from '@/shared/components/AlertModal';
import { useListPageState } from '@/shared/hooks/useListPageState';

export type SupplierStatusFilter = 'all' | SupplierStatus;

function sortSuppliers(list: Supplier[], sortBy: string): Supplier[] {
  const rows = [...list];
  switch (sortBy) {
    case 'name':
      return rows.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'pt-BR'));
    case 'category':
      return rows.sort((a, b) =>
        (a.categoryLabel || '').localeCompare(b.categoryLabel || '', 'pt-BR'),
      );
    case 'city':
      return rows.sort((a, b) =>
        (a.address.city || '').localeCompare(b.address.city || '', 'pt-BR'),
      );
    case 'rating':
      return rows.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    case 'totalPurchases':
      return rows.sort((a, b) => b.totalPurchases - a.totalPurchases);
    case 'updatedAt':
      return rows.sort(
        (a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime(),
      );
    default:
      return rows;
  }
}

function matchesSearch(supplier: Supplier, search: string): boolean {
  const term = search.trim().toLowerCase();
  if (!term) return true;
  return (
    supplier.name.toLowerCase().includes(term) ||
    (supplier.document ?? '').toLowerCase().includes(term) ||
    (supplier.email ?? '').toLowerCase().includes(term)
  );
}

export function useSuppliersListPage() {
  const listState = useListPageState<SupplierStatusFilter>({
    initialSortBy: 'name',
    initialFilter: 'all',
  });
  const { page, setPage, search, setSearch, sortBy, setSortBy, filter: statusFilter, setFilter: setStatusFilter } =
    listState;
  const [categoryFilter, setCategoryFilter] = useState('');

  const { data, isLoading, error } = useSuppliers({ limit: 500 });
  const { statsBySupplierId } = useSupplierPurchaseStats();
  const deleteSupplier = useDeleteSupplier();
  const { showError } = useAlertModal();

  const enrichedSuppliers = useMemo(() => {
    const suppliers = data?.suppliers ?? [];
    return suppliers.map((supplier) => {
      const stats = statsBySupplierId[supplier.id];
      return stats ? { ...supplier, ...stats } : supplier;
    });
  }, [data?.suppliers, statsBySupplierId]);

  const statusCounts = useMemo(() => {
    const counts: Record<SupplierStatusFilter, number> = {
      all: enrichedSuppliers.length,
      active: 0,
      inactive: 0,
      suspended: 0,
    };
    for (const supplier of enrichedSuppliers) {
      counts[supplier.status] += 1;
    }
    return counts;
  }, [enrichedSuppliers]);

  const filteredSuppliers = useMemo(() => {
    const filtered = enrichedSuppliers.filter(
      (supplier) =>
        matchesSearch(supplier, search) &&
        (statusFilter === 'all' || supplier.status === statusFilter) &&
        (!categoryFilter || supplier.category === categoryFilter),
    );
    return sortSuppliers(filtered, sortBy);
  }, [enrichedSuppliers, search, statusFilter, categoryFilter, sortBy]);

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
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    data,
    isLoading,
    error,
    suppliers: filteredSuppliers,
    statusCounts,
    handleDelete,
    isDeleting: deleteSupplier.isPending,
  };
}
