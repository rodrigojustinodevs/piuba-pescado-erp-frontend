'use client';

import { useMutation } from '@tanstack/react-query';
import { tankReportService } from '../services/tankReportService';
import type { TankFilters } from '../types';

/** Preview sob demanda (botão "Visualizar"). */
export function useTankPreview() {
  const mutation = useMutation({
    mutationFn: (filters: TankFilters) => tankReportService.preview(filters),
  });

  return {
    load: mutation.mutate,
    data: mutation.data,
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}
