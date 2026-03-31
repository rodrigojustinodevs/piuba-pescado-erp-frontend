'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/shared/contexts/ToastContext';
import { stockService } from '../services/stockService';
import type { AdjustStockPayload, Stock } from '../types';

export function useAdjustStock() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (args: { id: string; payload: AdjustStockPayload }) =>
      stockService.adjust(args.id, args.payload),
    onSuccess: (data: Stock) => {
      queryClient.invalidateQueries({ queryKey: ['stocks', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['stocks', 'detail', data.id] });
      showSuccess('Ajuste de estoque realizado com sucesso!');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao ajustar estoque. Tente novamente.');
    },
  });
}
