'use client';

import { useCallback, useMemo, useState } from 'react';
import type { Sensor, SensorStatus, SensorTypeFilter } from '../types';
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
      return list.sort((a, b) => (a.tank?.name || '').localeCompare(b.tank?.name || '', 'pt-BR'));
    case 'sensorType':
      return list.sort((a, b) => a.sensorType.localeCompare(b.sensorType, 'pt-BR'));
    default:
      return list;
  }
}

export function useSensorsListPage() {
  const listState = useListPageState<SensorStatus>({ initialSortBy: 'installationDate' });
  const { page, setPage, search, setSearch, filter, setFilter, sortBy, setSortBy } = listState;
  const [sensorTypeFilter, setSensorTypeFilter] = useState<SensorTypeFilter>('all');

  const { data, isLoading, error } = useSensors({ page, limit: 25, search });
  const deleteSensor = useDeleteSensor();
  const { showError } = useAlertModal();

  const sensors = useMemo(() => data?.sensors ?? [], [data?.sensors]);
  const sensorsByType = useMemo(() => {
    if (sensorTypeFilter === 'all') return sensors;
    return sensors.filter((s) => s.sensorType === sensorTypeFilter);
  }, [sensors, sensorTypeFilter]);

  const filteredSensors = useMemo(() => {
    if (filter === 'online') return sensorsByType.filter((s) => s.status === 'online');
    if (filter === 'offline') return sensorsByType.filter((s) => s.status === 'offline');
    if (filter === 'maintenance') return sensorsByType.filter((s) => s.status === 'maintenance');
    return sensorsByType;
  }, [sensorsByType, filter]);

  const sortedSensors = useMemo(
    () => sortSensors(filteredSensors, sortBy),
    [filteredSensors, sortBy],
  );

  const stats = useMemo(
    () => ({
      total: filteredSensors.length,
      offline: sensorsByType.filter((s) => s.status !== 'online').length,
      maintenance: sensorsByType.filter((s) => s.status === 'maintenance').length,
    }),
    [filteredSensors.length, sensorsByType],
  );

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
    filter,
    setFilter,
    sensorTypeFilter,
    setSensorTypeFilter,
    sortBy,
    setSortBy,
    data,
    isLoading,
    error,
    filteredSensors: sortedSensors,
    stats,
    handleDelete,
    isDeleting: deleteSensor.isPending,
  };
}
