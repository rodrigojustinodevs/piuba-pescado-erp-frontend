'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/shared/contexts/ToastContext';
import { purchaseService } from '../services/purchaseService';

export function useCancelPurchase() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (id: string) => purchaseService.cancel(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['purchases', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['purchases', 'detail', data.id] });
      showSuccess('Compra cancelada com sucesso!');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao cancelar compra. Tente novamente.');
    },
  });
}
