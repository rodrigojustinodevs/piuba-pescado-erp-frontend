'use client';

import { useCallback, useMemo, useState } from 'react';
import { useBatches } from '@/features/batch';
import { useTanks } from '@/features/tank/hooks/useTanks';
import { HttpError } from '@/shared/lib/http/httpError';
import { mapServerFieldErrors, validateFilters, type FilterFieldErrors } from '../schemas';
import type { ReportFilters } from '../types';
import { todayIso } from '../utils/format';
import { filtersSignature, useProductionExport } from './useProductionExport';
import { useProductionPreview } from './useProductionPreview';

export type ReportError = { message: string; status: number | null };

function toReportError(error: unknown): ReportError {
  if (error instanceof HttpError) {
    let message = error.message;
    if (error.status === 403) message = 'Você não tem permissão para acessar este relatório.';
    if (error.message.includes('master_admin')) {
      message = `${error.message} Selecione uma empresa ativa e tente novamente.`;
    }
    return { message, status: error.status };
  }
  return {
    message: error instanceof Error ? error.message : 'Erro inesperado.',
    status: null,
  };
}

export function useProductionReportPage() {
  const [filters, setFilters] = useState<ReportFilters>(() => ({
    cutoffDate: todayIso(),
    periodStart: '',
    periodEnd: '',
    status: 'all',
    batchIds: [],
    tankIds: [],
  }));
  const [includeDetails, setIncludeDetails] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FilterFieldErrors>({});
  const [error, setError] = useState<ReportError | null>(null);

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

  const updateFilters = useCallback((patch: Partial<ReportFilters>) => {
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

  const exportInput = useMemo(() => ({ ...filters, includeDetails }), [filters, includeDetails]);

  const onExport = useCallback(() => {
    if (!validate()) return;
    exporter.start(exportInput, { onError: handleFailure });
  }, [validate, exporter, exportInput, handleFailure]);

  // Bloqueia duplicatas: há export em andamento com os mesmos filtros.
  const isExportBusy =
    exporter.isStarting ||
    (exporter.isActive && exporter.filtersKey === filtersSignature(exportInput));

  return {
    filters,
    includeDetails,
    fieldErrors,
    error,
    batchOptions,
    tankOptions,
    optionsLoading: batchesLoading || tanksLoading,
    preview,
    exporter,
    isExportBusy,
    updateFilters,
    setIncludeDetails,
    onPreview,
    onExport,
  };
}
