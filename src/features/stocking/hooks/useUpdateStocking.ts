'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { stockingService } from '../services/stockingService';
import type { UpdateStockingData } from '../types';

export function useUpdateStocking() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: UpdateStockingData) => stockingService.update(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['stockings', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['stockings', 'detail', data.id] });
      showSuccess('Povoamento atualizado com sucesso!');
      router.push('/company/stockings');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao atualizar povoamento. Tente novamente.');
    },
  });
}
