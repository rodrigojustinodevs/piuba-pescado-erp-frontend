'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/shared/contexts/ToastContext';
import type { CreateMovementData } from '../types';
import { stockService } from '../services/stockService';

export function useRegisterStockMovement() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: CreateMovementData) => stockService.registerMovement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks', 'list'] });
      showSuccess('Movimentação registrada com sucesso!');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao registrar movimentação. Tente novamente.');
    },
  });
}
