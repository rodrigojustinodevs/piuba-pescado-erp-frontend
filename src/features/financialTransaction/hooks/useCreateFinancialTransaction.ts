'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/shared/contexts/ToastContext';
import type { CreateFinancialTransactionData } from '../types';
import { financialTransactionService } from '../services/financialTransactionService';

type Options = { skipNavigateToList?: boolean };

export function useCreateFinancialTransaction({ skipNavigateToList: _ = false }: Options = {}) {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: CreateFinancialTransactionData) =>
      financialTransactionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialTransactions', 'list'] });
      showSuccess('Transação cadastrada com sucesso!');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao cadastrar transação. Tente novamente.');
    },
  });
}
