'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/shared/contexts/ToastContext';
import { supplyService } from '../services/supplyService';
import { isHandledGlobally } from '@/shared/lib/http/apiError';

export function useDeleteSupply() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (id: string) => supplyService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplies', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['purchaseLookups', 'supplies'] });
      showSuccess('Produto excluído com sucesso!');
    },
    onError: (error: Error) => {
      if (isHandledGlobally(error)) return;
      showError(error.message || 'Erro ao excluir produto. Tente novamente.');
    },
  });
}
