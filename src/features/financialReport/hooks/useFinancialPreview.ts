'use client';

import { useMutation } from '@tanstack/react-query';
import { financialReportService } from '../services/financialReportService';
import type { FinancialFilters } from '../types';

/** Preview sob demanda (botão "Visualizar"). */
export function useFinancialPreview() {
  const mutation = useMutation({
    mutationFn: (filters: FinancialFilters) => financialReportService.preview(filters),
  });

  return {
    load: mutation.mutate,
    data: mutation.data,
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}
