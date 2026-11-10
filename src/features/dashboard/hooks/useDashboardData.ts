'use client';

import { useMemo } from 'react';
import { useBatches } from '@/features/batch/hooks/useBatches';
import { useFeedings } from '@/features/feeding/hooks/useFeedings';
import { useTanks } from '@/features/tank/hooks/useTanks';
import { useWaterQualities } from '@/features/waterQuality/hooks/useWaterQualities';
import {
  countBatchesByStatus,
  dailyTemperature,
  feedByBatch,
  filterByWindow,
  latestReadings,
  summarizeReadings,
} from '../utils/aggregate';

/** Tamanho da amostra buscada em cada módulo (não há endpoint agregado no backend). */
const SAMPLE_SIZE = 100;

export function useDashboardData() {
  const tanks = useTanks({ limit: SAMPLE_SIZE });
  const batches = useBatches({ limit: SAMPLE_SIZE });
  const waterQualities = useWaterQualities({ limit: SAMPLE_SIZE });
  const feedings = useFeedings({ limit: SAMPLE_SIZE });

  const queries = [tanks, batches, waterQualities, feedings];
  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.some((q) => q.isError);

  const data = useMemo(() => {
    const now = new Date();
    const tankList = tanks.data?.tanks ?? [];
    const batchList = batches.batches;
    const readings = filterByWindow(waterQualities.data?.waterQualities ?? [], (r) => r.measuredAt, now);
    const recentFeedings = filterByWindow(feedings.data?.feedings ?? [], (f) => f.feedingDate, now);

    const sampled = [
      [tanks.data?.total, tankList.length],
      [batches.pagination?.total, batchList.length],
      [waterQualities.data?.total, waterQualities.data?.waterQualities.length],
      [feedings.data?.total, feedings.data?.feedings.length],
    ];

    return {
      tankTotal: tanks.data?.total ?? tankList.length,
      activeTanks: tankList.filter((t) => t.status === 'active').length,
      batchTotal: batches.pagination?.total ?? batchList.length,
      activeBatches: batchList.filter((b) => b.status === 'active').length,
      batchStatus: countBatchesByStatus(batchList),
      readings: summarizeReadings(readings),
      temperatureSeries: dailyTemperature(readings, now),
      latestReadings: latestReadings(waterQualities.data?.waterQualities ?? []),
      feedByBatch: feedByBatch(recentFeedings),
      truncated: sampled.some(([total, loaded]) => (total ?? 0) > (loaded ?? 0)),
    };
  }, [tanks.data, batches.batches, batches.pagination, waterQualities.data, feedings.data]);

  return {
    data,
    isLoading,
    isError,
    refetch: () => Promise.all(queries.map((q) => q.refetch())),
  };
}
