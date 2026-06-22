'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { batchService } from '../services/batchService';
import type { BatchDistributionFormData } from '../schemas';
import type { BatchDistributionPayload } from '../types';

function toPayload(data: BatchDistributionFormData): BatchDistributionPayload {
  const notes = data.notes?.trim();
  return {
    supplierId: data.supplierId,
    totalCost: data.totalCost,
    entryDate: data.entryDate,
    species: data.species.trim(),
    cultivation: data.cultivation,
    ...(notes ? { notes } : {}),
    distribution: data.distribution.map((row) => ({
      tankId: row.tankId,
      quantity: row.quantity,
      averageWeight: row.averageWeight,
    })),
  };
}

type UseDistributeBatchOptions = {
  skipNavigateToList?: boolean;
};

export function useDistributeBatch(options: UseDistributeBatchOptions = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: BatchDistributionFormData) => batchService.distribute(toPayload(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches', 'list'] });
      showSuccess('Entrada de lote com distribuição registrada com sucesso!');
      if (!options.skipNavigateToList) {
        router.push('/company/batches');
      }
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao registrar entrada de lote. Tente novamente.');
    },
  });
}
