'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/shared/contexts/ToastContext';
import { financialCategoryService } from '../services/financialCategoryService';
import { isHandledGlobally } from '@/shared/lib/http/apiError';

export function useDeactivateFinancialCategory() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (id: string) => financialCategoryService.deactivate(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['financial-categories', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['financial-categories', 'detail', data.id] });
      showSuccess('Categoria financeira inativada com sucesso!');
    },
    onError: (error: Error) => {
      if (isHandledGlobally(error)) return;
      showError(error.message || 'Erro ao inativar categoria financeira. Tente novamente.');
    },
  });
}
