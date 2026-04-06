'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { saleService } from '../services/saleService';
import { translateSaleApiErrorMessagePtBR } from '../utils/errorMessagePtBR';

export function useDeleteSale() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (id: string) => saleService.delete(id),
    onSuccess: (_data, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['sales', 'list'] });
      queryClient.removeQueries({ queryKey: ['sales', 'detail', deletedId] });
      showSuccess('Venda excluída com sucesso!');
      router.push('/company/sales');
    },
    onError: (error: Error) => {
      const message = error.message ? translateSaleApiErrorMessagePtBR(error.message) : '';
      showError(message || 'Erro ao excluir venda. Tente novamente.');
    },
  });
}
