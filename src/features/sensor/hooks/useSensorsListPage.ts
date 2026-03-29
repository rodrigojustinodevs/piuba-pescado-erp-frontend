'use client';

import { useCallback, useMemo } from 'react';
import type { Sensor } from '../types';
import { useSensors } from './useSensors';
import { useDeleteSensor } from './useDeleteSensor';
import { useListPageState } from '@/shared/hooks/useListPageState';
import { useAlertModal } from '@/shared/components/AlertModal';

function sortSensors(sensors: Sensor[], sortBy: string): Sensor[] {
  const list = [...sensors];
  switch (sortBy) {
    case 'installationDate':
      return list.sort(
        (a, b) => new Date(b.installationDate).getTime() - new Date(a.installationDate).getTime(),
      );
    case 'tankName':
      return list.sort((a, b) => (a.tankName || '').localeCompare(b.tankName || '', 'pt-BR'));
    case 'sensorType':
      return list.sort((a, b) => a.sensorType.localeCompare(b.sensorType, 'pt-BR'));
    default:
      return list;
  }
}

export function useSensorsListPage() {
  const listState = useListPageState({ initialSortBy: 'installationDate' });
  const { page, setPage, search, setSearch, sortBy, setSortBy } = listState;

  const { data, isLoading, error } = useSensors({ page, limit: 25, search });
  const deleteSensor = useDeleteSensor();
  const { showError } = useAlertModal();

  const sensors = data?.sensors ?? [];
  const sortedSensors = useMemo(() => sortSensors(sensors, sortBy), [sensors, sortBy]);

  const handleDelete = useCallback(
    (targetId: string, label: string) => {
      showError(
        'Confirmar Exclusão',
        `Tem certeza que deseja excluir o sensor "${label}"? Esta ação não pode ser desfeita.`,
        'Sim, Excluir',
        () => deleteSensor.mutate(targetId),
      );
    },
    [showError, deleteSensor],
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
    sensors: sortedSensors,
    handleDelete,
    isDeleting: deleteSensor.isPending,
  };
}
