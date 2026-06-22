'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/shared/contexts/ToastContext';
import { feedingService } from '../services/feedingService';

/**
 * Hook para excluir uma alimentação (lista / modal — sem navegação).
 */
export function useDeleteFeeding() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (id: string) => feedingService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedings', 'list'] });
      showSuccess('Alimentação excluída com sucesso!');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao excluir alimentação. Tente novamente.');
    },
  });
}
