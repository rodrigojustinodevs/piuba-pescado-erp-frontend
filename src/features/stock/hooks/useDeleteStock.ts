'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/shared/contexts/ToastContext';
import { stockService } from '../services/stockService';
import { isHandledGlobally } from '@/shared/lib/http/apiError';

export function useDeleteStock() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (id: string) => stockService.delete(id),
    onSuccess: (_data, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['stocks', 'list'] });
      queryClient.removeQueries({ queryKey: ['stocks', 'detail', deletedId] });
      showSuccess('Local de armazenamento excluído com sucesso!');
    },
    onError: (error: Error) => {
      if (isHandledGlobally(error)) return;
      showError(error.message || 'Erro ao excluir local de armazenamento. Tente novamente.');
    },
  });
}
