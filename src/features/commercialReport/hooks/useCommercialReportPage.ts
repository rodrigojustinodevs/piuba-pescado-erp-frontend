'use client';

import { useMemo } from 'react';
import { useBatches } from '@/features/batch';
import { useClients } from '@/features/client/hooks/useClients';
import { todayIso } from '@/features/reportExport/format';
import { useReportPageState } from '@/features/reportExport/useReportPageState';
import { mapServerFieldErrors, validateFilters } from '../schemas';
import type { CommercialFilters } from '../types';
import { filtersSignature, useCommercialExport } from './useCommercialExport';
import { useCommercialPreview } from './useCommercialPreview';

const initialFilters = (): CommercialFilters => ({
  cutoffDate: todayIso(),
  periodStart: '',
  periodEnd: '',
  status: 'all',
  paymentMethod: '',
  clientIds: [],
  batchIds: [],
});

export function useCommercialReportPage() {
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
    clientOptions,
    optionsLoading: batchesLoading || clientsLoading,
    preview,
    exporter,
  };
}
