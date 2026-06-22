'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import type { CreateStockLocationData } from '../types';
import { stockService } from '../services/stockService';

type UseCreateStockOptions = {
  skipNavigateToList?: boolean;
};

export function useCreateStock({ skipNavigateToList }: UseCreateStockOptions = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: CreateStockLocationData) => stockService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks', 'list'] });
      showSuccess('Local de armazenamento cadastrado com sucesso!');
      if (!skipNavigateToList) {
        router.push('/company/stocks');
      }
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao cadastrar local de armazenamento. Tente novamente.');
    },
  });
}
