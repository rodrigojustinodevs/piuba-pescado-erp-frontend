'use client';

import { useCallback, useMemo, useState } from 'react';
import { useTanks } from '@/features/tank/hooks/useTanks';
import { useTankTypes } from '@/features/tank/hooks/useTankTypes';
import { todayIso } from '@/features/reportExport/format';
import { toReportError, type ReportError } from '@/features/reportExport/toReportError';
import { HttpError } from '@/shared/lib/http/httpError';
import { mapServerFieldErrors, validateFilters, type FilterFieldErrors } from '../schemas';
import type { TankFilters } from '../types';
import { filtersSignature, useTankExport } from './useTankExport';
import { useTankPreview } from './useTankPreview';

export function useTankReportPage() {
  const [filters, setFilters] = useState<TankFilters>(() => ({
    cutoffDate: todayIso(),
    status: 'all',
    occupancy: 'all',
    tankIds: [],
    tankTypeIds: [],
  }));
  const [fieldErrors, setFieldErrors] = useState<FilterFieldErrors>({});
  const [error, setError] = useState<ReportError | null>(null);

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

  const updateFilters = useCallback((patch: Partial<TankFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setFieldErrors({});
  }, []);

  const handleFailure = useCallback((failure: unknown) => {
    if (failure instanceof HttpError && failure.fieldErrors) {
      setFieldErrors(mapServerFieldErrors(failure.fieldErrors));
    }
    setError(toReportError(failure));
  }, []);

  const validate = useCallback((): boolean => {
    const errors = validateFilters(filters);
    setFieldErrors(errors);
    setError(null);
    return Object.keys(errors).length === 0;
  }, [filters]);

  const onPreview = useCallback(() => {
    if (!validate()) return;
    preview.load(filters, { onError: handleFailure });
  }, [validate, preview, filters, handleFailure]);

  const onExport = useCallback(() => {
    if (!validate()) return;
    exporter.start(filters, { onError: handleFailure });
  }, [validate, exporter, filters, handleFailure]);

  // Bloqueia duplicatas: há export em andamento com os mesmos filtros.
  const isExportBusy =
    exporter.isStarting || (exporter.isActive && exporter.filtersKey === filtersSignature(filters));

  return {
    filters,
    fieldErrors,
    error,
    tankOptions,
    tankTypeOptions,
    optionsLoading: tanksLoading || typesLoading,
    preview,
    exporter,
    isExportBusy,
    updateFilters,
    onPreview,
    onExport,
  };
}
