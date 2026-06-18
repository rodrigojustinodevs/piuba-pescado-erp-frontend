'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/shared/contexts/ToastContext';
import { financialTransactionService } from '../services/financialTransactionService';

export function useDeleteFinancialTransaction() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (id: string) => financialTransactionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialTransactions', 'list'] });
      showSuccess('Transação excluída com sucesso!');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao excluir transação. Tente novamente.');
    },
  });
}
