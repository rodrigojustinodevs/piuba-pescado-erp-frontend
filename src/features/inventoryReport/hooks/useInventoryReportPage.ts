'use client';

import { useCallback, useMemo, useState } from 'react';
import { useSupplies } from '@/features/supply';
import { toReportError, type ReportError } from '@/features/reportExport/toReportError';
import { todayIso } from '@/features/reportExport/format';
import { HttpError } from '@/shared/lib/http/httpError';
import { mapServerFieldErrors, validateFilters, type FilterFieldErrors } from '../schemas';
import type { InventoryFilters } from '../types';
import { filtersSignature, useInventoryExport } from './useInventoryExport';
import { useInventoryPreview } from './useInventoryPreview';

export function useInventoryReportPage() {
  const [filters, setFilters] = useState<InventoryFilters>(() => ({
    cutoffDate: todayIso(),
    periodStart: '',
    periodEnd: '',
    situation: 'all',
    categories: [],
    stockTypes: [],
    supplyIds: [],
    includeInactive: false,
  }));
  const [includeDetails, setIncludeDetails] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FilterFieldErrors>({});
  const [error, setError] = useState<ReportError | null>(null);

  const { data: suppliesData, isLoading: suppliesLoading } = useSupplies({ page: 1, limit: 1000 });
  const supplyOptions = useMemo(
    () => (suppliesData?.supplies ?? []).map((s) => ({ value: s.id, label: s.name })),
    [suppliesData],
  );

  const preview = useInventoryPreview();
  const exporter = useInventoryExport();

  const updateFilters = useCallback((patch: Partial<InventoryFilters>) => {
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
    supplyOptions,
    optionsLoading: suppliesLoading,
    preview,
    exporter,
    isExportBusy,
    updateFilters,
    setIncludeDetails,
    onPreview,
    onExport,
  };
}
