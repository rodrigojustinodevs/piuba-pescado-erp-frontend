'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/shared/contexts/ToastContext';
import type { UpdateFinancialTransactionData } from '../types';
import { financialTransactionService } from '../services/financialTransactionService';
import { isHandledGlobally } from '@/shared/lib/http/apiError';

type Options = { skipNavigateToList?: boolean };

export function useUpdateFinancialTransaction({ skipNavigateToList: _ = false }: Options = {}) {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: UpdateFinancialTransactionData) => financialTransactionService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialTransactions', 'list'] });
      showSuccess('Transação atualizada com sucesso!');
    },
    onError: (error: Error) => {
      if (isHandledGlobally(error)) return;
      showError(error.message || 'Erro ao atualizar transação. Tente novamente.');
    },
  });
}
