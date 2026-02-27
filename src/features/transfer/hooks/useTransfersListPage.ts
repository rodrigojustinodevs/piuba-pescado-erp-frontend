'use client';

import { useCallback, useMemo } from 'react';
import { useTransfers } from './useTransfers';
import { useDeleteTransfer } from './useDeleteTransfer';
import { useBatches } from '@/features/batch';
import { useTanks } from '@/features/tank';
import { formatBatchShortLabel } from '@/features/batch/utils/format';
import { useListPageState } from '@/shared/hooks/useListPageState';
import { useAlertModal } from '@/shared/components/AlertModal';
import { buildEntityMap } from '@/shared/utils/entityMap';

const PER_PAGE = 25;

export function useTransfersListPage() {
  const listState = useListPageState({ initialSortBy: 'createdAt' });
  const { page, setPage, search, setSearch, sortBy, setSortBy } = listState;

  const { data, isLoading, error } = useTransfers({ page, per_page: PER_PAGE });
  const { data: batchesData } = useBatches({ page: 1, limit: 500 });
  const { data: tanksData } = useTanks({ page: 1, limit: 1000 });
  const deleteTransfer = useDeleteTransfer();
  const { showError } = useAlertModal();

  const batchMap = useMemo(
    () => buildEntityMap(batchesData?.batches, formatBatchShortLabel),
    [batchesData?.batches],
  );

  const tankMap = useMemo(
    () => buildEntityMap(tanksData?.tanks, (tank) => tank.name || tank.id.slice(0, 8)),
    [tanksData?.tanks],
  );

  const transfers = data?.transfers ?? [];
  const total = data?.total ?? 0;
  const limit = data?.limit ?? PER_PAGE;

  const handleDelete = useCallback(
    (id: string) => {
      showError(
        'Confirmar Exclusão',
        'Tem certeza que deseja excluir esta transferência? Esta ação não pode ser desfeita.',
        'Sim, Excluir',
        () => deleteTransfer.mutate(id),
      );
    },
    [showError, deleteTransfer],
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
    transfers,
    total,
    limit,
    batchMap,
    tankMap,
    handleDelete,
    isDeleting: deleteTransfer.isPending,
  };
}
