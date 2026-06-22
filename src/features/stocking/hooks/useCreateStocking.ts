'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { stockingService } from '../services/stockingService';
import type { CreateStockingData } from '../types';

type UseCreateStockingOptions = {
  skipNavigateToList?: boolean;
};

export function useCreateStocking(options: UseCreateStockingOptions = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: CreateStockingData) => stockingService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stockings', 'list'] });
      showSuccess('Povoamento criado com sucesso!');
      if (!options.skipNavigateToList) {
        router.push('/company/stockings');
      }
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao criar povoamento. Tente novamente.');
    },
  });
}
