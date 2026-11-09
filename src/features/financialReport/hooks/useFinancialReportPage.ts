'use client';

import { useCallback, useMemo, useState } from 'react';
import { useFinancialCategories } from '@/features/financialCategory/hooks/useFinancialCategories';
import { todayIso } from '@/features/reportExport/format';
import { toReportError, type ReportError } from '@/features/reportExport/toReportError';
import { HttpError } from '@/shared/lib/http/httpError';
import { mapServerFieldErrors, validateFilters, type FilterFieldErrors } from '../schemas';
import type { FinancialFilters } from '../types';
import { filtersSignature, useFinancialExport } from './useFinancialExport';
import { useFinancialPreview } from './useFinancialPreview';

export function useFinancialReportPage() {
  const [filters, setFilters] = useState<FinancialFilters>(() => ({
    cutoffDate: todayIso(),
    periodStart: '',
    periodEnd: '',
    categoryIds: [],
  }));
  const [includeDetails, setIncludeDetails] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FilterFieldErrors>({});
  const [error, setError] = useState<ReportError | null>(null);

  const { data: categoriesData, isLoading: optionsLoading } = useFinancialCategories({
    page: 1,
    limit: 1000,
  });
  const categoryOptions = useMemo(
    () => (categoriesData?.financialCategories ?? []).map((c) => ({ value: c.id, label: c.name })),
    [categoriesData],
  );

  const preview = useFinancialPreview();
  const exporter = useFinancialExport();

  const updateFilters = useCallback((patch: Partial<FinancialFilters>) => {
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
    categoryOptions,
    optionsLoading,
    preview,
    exporter,
    isExportBusy,
    updateFilters,
    setIncludeDetails,
    onPreview,
    onExport,
  };
}
