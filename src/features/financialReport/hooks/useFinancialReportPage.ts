'use client';

import { useMemo } from 'react';
import { useFinancialCategories } from '@/features/financialCategory/hooks/useFinancialCategories';
import { todayIso } from '@/features/reportExport/format';
import { useReportPageState } from '@/features/reportExport/useReportPageState';
import { mapServerFieldErrors, validateFilters } from '../schemas';
import type { FinancialFilters } from '../types';
import { filtersSignature, useFinancialExport } from './useFinancialExport';
import { useFinancialPreview } from './useFinancialPreview';

const initialFilters = (): FinancialFilters => ({
  cutoffDate: todayIso(),
  periodStart: '',
  periodEnd: '',
  categoryIds: [],
});

export function useFinancialReportPage() {
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
  const state = useReportPageState({
    initialFilters,
    validateFilters,
    mapServerFieldErrors,
    preview,
    exporter,
    signature: filtersSignature,
  });

  return { ...state, categoryOptions, optionsLoading, preview, exporter };
}
