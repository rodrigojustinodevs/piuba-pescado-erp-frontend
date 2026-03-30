'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import type { CreatePurchaseData } from '../types';
import { purchaseService } from '../services/purchaseService';

export function useCreatePurchase() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: CreatePurchaseData) => purchaseService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases', 'list'] });
      showSuccess('Compra registrada com sucesso!');
      router.push('/company/purchases');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao registrar compra. Tente novamente.');
    },
  });
}
