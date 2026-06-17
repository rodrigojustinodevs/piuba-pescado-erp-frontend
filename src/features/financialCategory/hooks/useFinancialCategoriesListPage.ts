'use client';

import { useCallback, useMemo, useState } from 'react';
import type {
  FinancialCategoryCatalogStats,
  FinancialCategoryStatusStrict,
  FinancialCategoryTypeStrict,
} from '../types';
import { useFinancialCategories } from './useFinancialCategories';
import { useDeleteFinancialCategory } from './useDeleteFinancialCategory';
import { useAlertModal } from '@/shared/components/AlertModal';
import { useListPageState } from '@/shared/hooks/useListPageState';

const PER_PAGE = 25;
type TypeFilter = FinancialCategoryTypeStrict | 'all';
type StatusFilter = FinancialCategoryStatusStrict | 'all';

export function useFinancialCategoriesListPage() {
  const listState = useListPageState({ initialSortBy: 'name' });
  const { page, setPage, search, setSearch, sortBy, setSortBy } = listState;

  const [type, setType] = useState<TypeFilter>('all');
  const [status, setStatus] = useState<StatusFilter>('all');

  const deleteCategory = useDeleteFinancialCategory();
  const { showError } = useAlertModal();

  const { data, isLoading, error } = useFinancialCategories({
    page,
    limit: PER_PAGE,
    type: type === 'all' ? undefined : type,
    status: status === 'all' ? undefined : status,
  });

  const financialCategories = useMemo(() => {
    let rows = [...(data?.financialCategories ?? [])];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.notes ?? '').toLowerCase().includes(q),
      );
    }

    if (sortBy === 'type') {
      return rows.sort((a, b) => (a.typeLabel || '').localeCompare(b.typeLabel || '', 'pt-BR'));
    }
    if (sortBy === 'status') {
      return rows.sort((a, b) => (a.statusLabel || '').localeCompare(b.statusLabel || '', 'pt-BR'));
    }
    return rows.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'pt-BR'));
  }, [data?.financialCategories, search, sortBy]);

  const stats = useMemo<FinancialCategoryCatalogStats>(() => {
    const all = data?.financialCategories ?? [];
    return {
      total: data?.total ?? 0,
      revenueCount: all.filter((c) => c.type === 'revenue' || c.type === 'income').length,
      expenseCount: all.filter((c) => c.type === 'expense').length,
    };
  }, [data]);

  const handleDeleteCategory = useCallback(
    (targetId: string, label: string) => {
      showError(
        'Confirmar exclusão',
        `Tem certeza que deseja excluir a categoria "${label}"? Esta ação não pode ser desfeita.`,
        'Sim, excluir',
        () => deleteCategory.mutate(targetId),
      );
    },
    [showError, deleteCategory],
  );

  return {
    page,
    setPage,
    search,
    setSearch,
    sortBy,
    setSortBy,
    type,
    setType,
    status,
    setStatus,
    data,
    isLoading,
    error,
    financialCategories,
    stats,
    limit: data?.limit ?? PER_PAGE,
    total: data?.total ?? 0,
    onDeleteCategory: handleDeleteCategory,
    isDeletingCategory: deleteCategory.isPending,
  };
}
