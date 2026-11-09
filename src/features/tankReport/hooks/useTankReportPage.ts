'use client';

import { useMemo } from 'react';
import { todayIso } from '@/features/reportExport/format';
import { useReportPageState } from '@/features/reportExport/useReportPageState';
import { useTanks } from '@/features/tank/hooks/useTanks';
import { useTankTypes } from '@/features/tank/hooks/useTankTypes';
import { mapServerFieldErrors, validateFilters } from '../schemas';
import type { TankFilters } from '../types';
import { filtersSignature, useTankExport } from './useTankExport';
import { useTankPreview } from './useTankPreview';

const initialFilters = (): TankFilters => ({
  cutoffDate: todayIso(),
  status: 'all',
  occupancy: 'all',
  tankIds: [],
  tankTypeIds: [],
});

/** Este relatório não tem anexo analítico: o export usa só os filtros. */
const buildExportInput = (filters: TankFilters): TankFilters => filters;

export function useTankReportPage() {
  const { data: tanksData, isLoading: tanksLoading } = useTanks({ page: 1, limit: 1000 });
  const { data: typesData, isLoading: typesLoading } = useTankTypes();

  const tankOptions = useMemo(
    () => (tanksData?.tanks ?? []).map((t) => ({ value: t.id, label: t.name })),
    [tanksData],
  );
  const tankTypeOptions = useMemo(
    () => (typesData?.tankTypes ?? []).map((t) => ({ value: t.id, label: t.name })),
    [typesData],
  );

  const preview = useTankPreview();
  const exporter = useTankExport();
  const state = useReportPageState({
    initialFilters,
    validateFilters,
    mapServerFieldErrors,
    preview,
    exporter,
    signature: filtersSignature,
    buildExportInput,
  });

  return {
    ...state,
    tankOptions,
    tankTypeOptions,
    optionsLoading: tanksLoading || typesLoading,
    preview,
    exporter,
  };
}
