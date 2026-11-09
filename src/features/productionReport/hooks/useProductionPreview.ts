'use client';

import { useMutation } from '@tanstack/react-query';
import { productionReportService } from '../services/productionReportService';
import type { ReportFilters } from '../types';

/** Preview sob demanda (botão "Visualizar"); o resultado fica em `data` até a próxima chamada. */
export function useProductionPreview() {
  const mutation = useMutation({
    mutationFn: (filters: ReportFilters) => productionReportService.preview(filters),
  });

  return {
    load: mutation.mutate,
    data: mutation.data,
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}
