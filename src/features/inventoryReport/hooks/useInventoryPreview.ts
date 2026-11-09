'use client';

import { useMutation } from '@tanstack/react-query';
import { inventoryReportService } from '../services/inventoryReportService';
import type { InventoryFilters } from '../types';

/** Preview sob demanda (botão "Visualizar"). */
export function useInventoryPreview() {
  const mutation = useMutation({
    mutationFn: (filters: InventoryFilters) => inventoryReportService.preview(filters),
  });

  return {
    load: mutation.mutate,
    data: mutation.data,
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}
