'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import type { UpdateStockData } from '../types';
import { stockService } from '../services/stockService';

export function useUpdateStock() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: UpdateStockData) => stockService.update(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['stocks', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['stocks', 'detail', data.id] });
      showSuccess('Estoque atualizado com sucesso!');
      router.push('/company/stocks');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao atualizar estoque. Tente novamente.');
    },
  });
}
