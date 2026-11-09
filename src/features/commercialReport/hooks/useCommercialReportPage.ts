'use client';

import { useCallback, useMemo, useState } from 'react';
import { useBatches } from '@/features/batch';
import { useClients } from '@/features/client/hooks/useClients';
import { toReportError, type ReportError } from '@/features/reportExport/toReportError';
import { todayIso } from '@/features/reportExport/format';
import { HttpError } from '@/shared/lib/http/httpError';
import { mapServerFieldErrors, validateFilters, type FilterFieldErrors } from '../schemas';
import type { CommercialFilters } from '../types';
import { filtersSignature, useCommercialExport } from './useCommercialExport';
import { useCommercialPreview } from './useCommercialPreview';

export function useCommercialReportPage() {
  const [filters, setFilters] = useState<CommercialFilters>(() => ({
    cutoffDate: todayIso(),
    periodStart: '',
    periodEnd: '',
    status: 'all',
    paymentMethod: '',
    clientIds: [],
    batchIds: [],
  }));
  const [includeDetails, setIncludeDetails] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FilterFieldErrors>({});
  const [error, setError] = useState<ReportError | null>(null);

  const { batches, isLoading: batchesLoading } = useBatches({ page: 1, limit: 1000 });
  const { data: clientsData, isLoading: clientsLoading } = useClients({ page: 1, limit: 1000 });

  const batchOptions = useMemo(
    () =>
      batches.map((b) => ({
        value: b.id,
        label: b.name ? `${b.name} — ${b.tank?.name ?? ''}`.replace(/ — $/, '') : b.id,
      })),
    [batches],
  );
  const clientOptions = useMemo(
    () => (clientsData?.clients ?? []).map((c) => ({ value: c.id, label: c.tradeName ?? c.name })),
    [clientsData],
  );

  const preview = useCommercialPreview();
  const exporter = useCommercialExport();

  const updateFilters = useCallback((patch: Partial<CommercialFilters>) => {
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
    clientOptions,
    optionsLoading: batchesLoading || clientsLoading,
    preview,
    exporter,
    isExportBusy,
    updateFilters,
    setIncludeDetails,
    onPreview,
    onExport,
  };
}
