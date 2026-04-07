'use client';

import { useCallback, useMemo, useState } from 'react';
import type { FinancialCategoryStatus, FinancialCategoryType } from '../types';
import { useFinancialCategories } from './useFinancialCategories';
import { useActivateFinancialCategory } from './useActivateFinancialCategory';
import { useDeactivateFinancialCategory } from './useDeactivateFinancialCategory';
import { useDeleteFinancialCategory } from './useDeleteFinancialCategory';
import { useAlertModal } from '@/shared/components/AlertModal';
import { useListPageState } from '@/shared/hooks/useListPageState';

const PER_PAGE = 25;

export function useFinancialCategoriesListPage() {
  const listState = useListPageState({ initialSortBy: 'name' });
  const { page, setPage, sortBy, setSortBy } = listState;

  const [type, setType] = useState<FinancialCategoryType | 'all'>('all');
  const [status, setStatus] = useState<FinancialCategoryStatus | 'all'>('all');

  const deleteCategory = useDeleteFinancialCategory();
  const activateCategory = useActivateFinancialCategory();
  const deactivateCategory = useDeactivateFinancialCategory();
  const { showError } = useAlertModal();

  const { data, isLoading, error } = useFinancialCategories({
    page,
    limit: PER_PAGE,
    type: type === 'all' ? undefined : type,
    status: status === 'all' ? undefined : status,
  });

  const financialCategories = useMemo(() => {
    const rows = [...(data?.financialCategories ?? [])];
    if (sortBy === 'type') {
      return rows.sort((a, b) => (a.typeLabel || '').localeCompare(b.typeLabel || '', 'pt-BR'));
    }
    if (sortBy === 'status') {
      return rows.sort((a, b) => (a.statusLabel || '').localeCompare(b.statusLabel || '', 'pt-BR'));
    }
    return rows.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'pt-BR'));
  }, [data?.financialCategories, sortBy]);

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

  const handleActivateCategory = useCallback(
    (targetId: string, label: string) => {
      showError(
        'Confirmar ativação',
        `Deseja ativar a categoria "${label}"?`,
        'Sim, ativar',
        () => activateCategory.mutate(targetId),
      );
    },
    [showError, activateCategory],
  );

  const handleDeactivateCategory = useCallback(
    (targetId: string, label: string) => {
      showError(
        'Confirmar inativação',
        `Deseja inativar a categoria "${label}"?`,
        'Sim, inativar',
        () => deactivateCategory.mutate(targetId),
      );
    },
    [showError, deactivateCategory],
  );

  return {
    page,
    setPage,
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
    limit: data?.limit ?? PER_PAGE,
    total: data?.total ?? 0,
    onDeleteCategory: handleDeleteCategory,
    isDeletingCategory: deleteCategory.isPending,
    onActivateCategory: handleActivateCategory,
    isActivatingCategory: activateCategory.isPending,
    onDeactivateCategory: handleDeactivateCategory,
    isDeactivatingCategory: deactivateCategory.isPending,
  };
}
