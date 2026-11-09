'use client';

import { useMemo } from 'react';
import { todayIso } from '@/features/reportExport/format';
import { useReportPageState } from '@/features/reportExport/useReportPageState';
import { useSupplies } from '@/features/supply';
import { mapServerFieldErrors, validateFilters } from '../schemas';
import type { InventoryFilters } from '../types';
import { filtersSignature, useInventoryExport } from './useInventoryExport';
import { useInventoryPreview } from './useInventoryPreview';

const initialFilters = (): InventoryFilters => ({
  cutoffDate: todayIso(),
  periodStart: '',
  periodEnd: '',
  situation: 'all',
  categories: [],
  stockTypes: [],
  supplyIds: [],
  includeInactive: false,
});

export function useInventoryReportPage() {
  const { data: suppliesData, isLoading: suppliesLoading } = useSupplies({ page: 1, limit: 1000 });
  const supplyOptions = useMemo(
    () => (suppliesData?.supplies ?? []).map((s) => ({ value: s.id, label: s.name })),
    [suppliesData],
  );

  const preview = useInventoryPreview();
  const exporter = useInventoryExport();
  const state = useReportPageState({
    initialFilters,
    validateFilters,
    mapServerFieldErrors,
    preview,
    exporter,
    signature: filtersSignature,
  });

  return { ...state, supplyOptions, optionsLoading: suppliesLoading, preview, exporter };
}
