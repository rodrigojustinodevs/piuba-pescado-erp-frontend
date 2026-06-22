'use client';

import { useCallback, useMemo } from 'react';
import type { SensorReading } from '../types';
import { useSensorReadings } from './useSensorReadings';
import { useDeleteSensorReading } from './useDeleteSensorReading';
import { useListPageState } from '@/shared/hooks/useListPageState';
import { useAlertModal } from '@/shared/components/AlertModal';

function sortSensorReadings(readings: SensorReading[], sortBy: string): SensorReading[] {
  const list = [...readings];
  switch (sortBy) {
    case 'measuredAt':
      return list.sort(
        (a, b) => new Date(b.measuredAt).getTime() - new Date(a.measuredAt).getTime(),
      );
    case 'tankName':
      return list.sort((a, b) =>
        (a.sensor?.tank?.name || '').localeCompare(b.sensor?.tank?.name || '', 'pt-BR'),
      );
    case 'value':
      return list.sort((a, b) => b.value - a.value);
    default:
      return list;
  }
}

export function useSensorReadingsListPage() {
  const listState = useListPageState({ initialSortBy: 'measuredAt' });
  const { page, setPage, search, setSearch, sortBy } = listState;

  const { data, isLoading, error } = useSensorReadings({ page, limit: 25, search });
  const deleteReading = useDeleteSensorReading();
  const { showError } = useAlertModal();

  const sensorReadings = data?.sensorReadings ?? [];
  const sortedReadings = useMemo(
    () => sortSensorReadings(sensorReadings, sortBy),
    [sensorReadings, sortBy],
  );

  const handleDelete = useCallback(
    (targetId: string, label: string) => {
      showError(
        'Confirmar Exclusão',
        `Tem certeza que deseja excluir a leitura "${label}"? Esta ação não pode ser desfeita.`,
        'Sim, Excluir',
        () => deleteReading.mutate(targetId),
      );
    },
    [showError, deleteReading],
  );

  return {
    page,
    setPage,
    search,
    setSearch,
    data,
    isLoading,
    error,
    sensorReadings: sortedReadings,
    handleDelete,
    isDeleting: deleteReading.isPending,
  };
}
