'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/shared/contexts/ToastContext';
import { saleService } from '../services/saleService';
import { translateSaleApiErrorMessagePtBR } from '../utils/errorMessagePtBR';

export function useCancelSale() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (id: string) => saleService.cancel(id),
    onSuccess: (sale) => {
      queryClient.invalidateQueries({ queryKey: ['sales', 'list'] });
      queryClient.setQueryData(['sales', 'detail', sale.id], sale);
      showSuccess('Cancelamento concluído. Esta venda está cancelada.');
    },
    onError: (error: Error) => {
      const message = error.message ? translateSaleApiErrorMessagePtBR(error.message) : '';
      showError(message || 'Erro ao cancelar venda. Tente novamente.');
    },
  });
}
