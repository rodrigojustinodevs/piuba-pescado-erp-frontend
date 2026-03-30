'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/shared/contexts/ToastContext';
import { purchaseService } from '../services/purchaseService';

export function useReceivePurchase() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (id: string) => purchaseService.receive(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['purchases', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['purchases', 'detail', data.id] });
      showSuccess('Compra recebida com sucesso!');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao receber compra. Tente novamente.');
    },
  });
}
