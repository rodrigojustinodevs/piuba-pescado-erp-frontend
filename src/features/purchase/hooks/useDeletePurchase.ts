'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { purchaseService } from '../services/purchaseService';

export function useDeletePurchase() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (id: string) => purchaseService.delete(id),
    onSuccess: (_data, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['purchases', 'list'] });
      queryClient.removeQueries({ queryKey: ['purchases', 'detail', deletedId] });
      showSuccess('Compra excluída com sucesso!');
      router.push('/company/purchases');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao excluir compra. Tente novamente.');
    },
  });
}
