'use client';

import { useMemo } from 'react';
import { useBatches } from '@/features/batch';
import { todayIso } from '@/features/reportExport/format';
import { useReportPageState } from '@/features/reportExport/useReportPageState';
import { useTanks } from '@/features/tank/hooks/useTanks';
import { mapServerFieldErrors, validateFilters } from '../schemas';
import type { ReportFilters } from '../types';
import { filtersSignature, useProductionExport } from './useProductionExport';
import { useProductionPreview } from './useProductionPreview';

const initialFilters = (): ReportFilters => ({
  cutoffDate: todayIso(),
  periodStart: '',
  periodEnd: '',
  status: 'all',
  batchIds: [],
  tankIds: [],
});

export function useProductionReportPage() {
  const { batches, isLoading: batchesLoading } = useBatches({ page: 1, limit: 1000 });
  const { data: tanksData, isLoading: tanksLoading } = useTanks({ page: 1, limit: 1000 });

  const batchOptions = useMemo(
    () =>
      batches.map((b) => ({
        value: b.id,
        label: b.name ? `${b.name} — ${b.tank?.name ?? ''}`.replace(/ — $/, '') : b.id,
      })),
    [batches],
  );
  const tankOptions = useMemo(
    () => (tanksData?.tanks ?? []).map((t) => ({ value: t.id, label: t.name })),
    [tanksData],
  );

  const preview = useProductionPreview();
  const exporter = useProductionExport();
  const state = useReportPageState({
    initialFilters,
    validateFilters,
    mapServerFieldErrors,
    preview,
    exporter,
    signature: filtersSignature,
  });

  return {
    ...state,
    batchOptions,
    tankOptions,
    optionsLoading: batchesLoading || tanksLoading,
    preview,
    exporter,
  };
}
