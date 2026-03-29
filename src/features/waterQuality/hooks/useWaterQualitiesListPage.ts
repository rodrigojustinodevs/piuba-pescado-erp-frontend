'use client';

import { useCallback, useMemo } from 'react';
import type { WaterQuality } from '../types';
import { useWaterQualities } from './useWaterQualities';
import { useDeleteWaterQuality } from './useDeleteWaterQuality';
import { useListPageState } from '@/shared/hooks/useListPageState';
import { useAlertModal } from '@/shared/components/AlertModal';

function sortWaterQualities(items: WaterQuality[], sortBy: string): WaterQuality[] {
  const list = [...items];
  switch (sortBy) {
    case 'measuredAt':
      return list.sort((a, b) => {
        const tb = new Date(b.measuredAt.replace(' ', 'T')).getTime();
        const ta = new Date(a.measuredAt.replace(' ', 'T')).getTime();
        return tb - ta;
      });
    case 'tankName':
      return list.sort((a, b) => (a.tankName || '').localeCompare(b.tankName || '', 'pt-BR'));
    case 'ph':
      return list.sort((a, b) => parseFloat(b.ph) - parseFloat(a.ph));
    default:
      return list;
  }
}

export function useWaterQualitiesListPage() {
  const listState = useListPageState({ initialSortBy: 'measuredAt' });
  const { page, setPage, search, setSearch, sortBy, setSortBy } = listState;

  const { data, isLoading, error } = useWaterQualities({ page, limit: 25, search });
  const deleteRecord = useDeleteWaterQuality();
  const { showError } = useAlertModal();

  const waterQualities = data?.waterQualities ?? [];
  const sorted = useMemo(() => sortWaterQualities(waterQualities, sortBy), [waterQualities, sortBy]);

  const handleDelete = useCallback(
    (targetId: string, label: string) => {
      showError(
        'Confirmar Exclusão',
        `Tem certeza que deseja excluir a medição "${label}"? Esta ação não pode ser desfeita.`,
        'Sim, Excluir',
        () => deleteRecord.mutate(targetId),
      );
    },
    [showError, deleteRecord],
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
    waterQualities: sorted,
    handleDelete,
    isDeleting: deleteRecord.isPending,
  };
}
