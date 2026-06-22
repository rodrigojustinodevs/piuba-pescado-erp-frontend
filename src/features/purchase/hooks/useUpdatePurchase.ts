'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { purchaseService } from '../services/purchaseService';
import type { UpdatePurchaseData } from '../types';

type UseUpdatePurchaseOptions = {
  skipNavigateToList?: boolean;
};

export function useUpdatePurchase({ skipNavigateToList = false }: UseUpdatePurchaseOptions = {}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: UpdatePurchaseData) => purchaseService.update(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['purchases', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['purchases', 'detail', data.id] });
      showSuccess('Compra atualizada com sucesso!');
      if (!skipNavigateToList) {
        router.push('/company/purchases');
      }
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao atualizar compra. Tente novamente.');
    },
  });
}
