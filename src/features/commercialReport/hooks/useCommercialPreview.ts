'use client';

import { useMutation } from '@tanstack/react-query';
import { commercialReportService } from '../services/commercialReportService';
import type { CommercialFilters } from '../types';

/** Preview sob demanda (botão "Visualizar"). */
export function useCommercialPreview() {
  const mutation = useMutation({
    mutationFn: (filters: CommercialFilters) => commercialReportService.preview(filters),
  });

  return {
    load: mutation.mutate,
    data: mutation.data,
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}
