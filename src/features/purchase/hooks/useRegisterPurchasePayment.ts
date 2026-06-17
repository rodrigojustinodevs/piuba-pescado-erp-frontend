'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/shared/contexts/ToastContext';
import { purchaseService } from '../services/purchaseService';
import type { CreatePaymentData } from '../types';

export function useRegisterPurchasePayment() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreatePaymentData }) =>
      purchaseService.registerPayment(id, data),
    onSuccess: (purchase) => {
      queryClient.invalidateQueries({ queryKey: ['purchases', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['purchases', 'detail', purchase.id] });
      queryClient.invalidateQueries({ queryKey: ['purchases', 'payments', purchase.id] });
      showSuccess('Pagamento registrado com sucesso!');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao registrar pagamento. Tente novamente.');
    },
  });
}
