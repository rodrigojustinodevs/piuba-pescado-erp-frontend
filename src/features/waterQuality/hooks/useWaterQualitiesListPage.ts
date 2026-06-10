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
      return list.sort((a, b) => (a.tank?.name || '').localeCompare(b.tank?.name || '', 'pt-BR'));
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

  const waterQualitiesRaw = useMemo(() => data?.waterQualities ?? [], [data?.waterQualities]);
  const sorted = useMemo(
    () => sortWaterQualities(waterQualitiesRaw, sortBy),
    [waterQualitiesRaw, sortBy],
  );

  const stats = useMemo(() => {
    const list = sorted;

    const uniqueTanksOnPage = new Set(list.map((w) => w.tank?.id).filter(Boolean)).size;
    const numericPhs = list
      .map((w) => parseFloat(String(w.ph).replace(',', '.')))
      .filter((n) => Number.isFinite(n));
    const avgPh =
      numericPhs.length > 0
        ? (numericPhs.reduce((a, b) => a + b, 0) / numericPhs.length).toFixed(2)
        : '—';
    let latestRaw: string | null = null;
    let latestTs = -Infinity;
    for (const w of list) {
      if (!w.measuredAt) continue;
      const t = new Date(w.measuredAt.replace(' ', 'T')).getTime();
      if (Number.isFinite(t) && t > latestTs) {
        latestTs = t;
        latestRaw = w.measuredAt;
      }
    }
    let lastMeasurementLabel = '—';
    if (latestRaw) {
      try {
        const d = new Date(latestRaw.replace(' ', 'T'));
        if (!Number.isNaN(d.getTime())) {
          lastMeasurementLabel = d.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
        }
      } catch {
        lastMeasurementLabel = latestRaw;
      }
    }
    return {
      total: data?.total ?? 0,
      uniqueTanksOnPage,
      avgPhDisplay: avgPh,
      lastMeasurementLabel,
      score: data?.score ?? 0,
      excellent: data?.excellent ?? 0,
      good: data?.good ?? 0,
      warning: data?.warning ?? 0,
      critical: data?.critical ?? 0,
      unknown: data?.unknown ?? 0,
    };
  }, [
    sorted,
    data?.total,
    data?.score,
    data?.excellent,
    data?.good,
    data?.warning,
    data?.critical,
    data?.unknown,
  ]);

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
    stats,
    handleDelete,
    isDeleting: deleteRecord.isPending,
  };
}
