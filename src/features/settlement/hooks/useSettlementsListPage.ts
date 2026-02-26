'use client';

import { useCallback, useMemo } from 'react';
import { useSettlements } from './useSettlements';
import { useDeleteSettlement } from './useDeleteSettlement';
import { useBatches } from '@/features/batch';
import { formatBatchShortLabel } from '@/features/batch/utils/format';
import { useListPageState } from '@/shared/hooks/useListPageState';
import { useAlertModal } from '@/shared/components/AlertModal';
import { buildEntityMap } from '@/shared/utils/entityMap';

const PER_PAGE = 25;

export function useSettlementsListPage() {
  const listState = useListPageState({ initialSortBy: 'settlementDate' });
  const { page, setPage, search, setSearch, sortBy, setSortBy } = listState;

  const { data, isLoading, error } = useSettlements({ page, per_page: PER_PAGE });
  const { data: batchesData } = useBatches({ page: 1, limit: 500 });
  const deleteSettlement = useDeleteSettlement();
  const { showError } = useAlertModal();

  const batchMap = useMemo(
    () => buildEntityMap(batchesData?.batches, formatBatchShortLabel),
    [batchesData?.batches],
  );

  const settlements = data?.settlements ?? [];
  const total = data?.total ?? 0;
  const limit = data?.limit ?? PER_PAGE;

  const handleDelete = useCallback(
    (id: string, label: string) => {
      showError(
        'Confirmar Exclusão',
        `Tem certeza que deseja excluir o povoamento "${label}"? Esta ação não pode ser desfeita.`,
        'Sim, Excluir',
        () => deleteSettlement.mutate(id),
      );
    },
    [showError, deleteSettlement],
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
    settlements,
    total,
    limit,
    batchMap,
    handleDelete,
    isDeleting: deleteSettlement.isPending,
  };
}
