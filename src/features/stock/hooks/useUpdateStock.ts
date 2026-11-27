'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import type { UpdateStockLocationData } from '../types';
import { stockService } from '../services/stockService';
import { isHandledGlobally } from '@/shared/lib/http/apiError';

type UseUpdateStockOptions = {
  skipNavigateToList?: boolean;
};

export function useUpdateStock({ skipNavigateToList }: UseUpdateStockOptions = {}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: UpdateStockLocationData) => stockService.update(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['stocks', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['stocks', 'detail', data.id] });
      showSuccess('Local de armazenamento atualizado com sucesso!');
      if (!skipNavigateToList) {
        router.push('/company/stocks');
      }
    },
    onError: (error: Error) => {
      if (isHandledGlobally(error)) return;
      showError(error.message || 'Erro ao atualizar local de armazenamento. Tente novamente.');
    },
  });
}
