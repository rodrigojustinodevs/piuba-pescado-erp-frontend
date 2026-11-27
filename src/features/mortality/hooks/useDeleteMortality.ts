'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/shared/contexts/ToastContext';
import { mortalityService } from '../services/mortalityService';
import { isHandledGlobally } from '@/shared/lib/http/apiError';

export function useDeleteMortality() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (id: string) => mortalityService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mortalities', 'list'] });
      showSuccess('Mortalidade excluida com sucesso!');
    },
    onError: (error: Error) => {
      if (isHandledGlobally(error)) return;
      showError(error.message || 'Erro ao excluir mortalidade. Tente novamente.');
    },
  });
}
