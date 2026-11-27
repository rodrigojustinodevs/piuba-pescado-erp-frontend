'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/shared/contexts/ToastContext';
import { financialCategoryService } from '../services/financialCategoryService';
import { isHandledGlobally } from '@/shared/lib/http/apiError';

export function useActivateFinancialCategory() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (id: string) => financialCategoryService.activate(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['financial-categories', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['financial-categories', 'detail', data.id] });
      showSuccess('Categoria financeira ativada com sucesso!');
    },
    onError: (error: Error) => {
      if (isHandledGlobally(error)) return;
      showError(error.message || 'Erro ao ativar categoria financeira. Tente novamente.');
    },
  });
}
