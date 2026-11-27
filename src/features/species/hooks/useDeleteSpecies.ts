'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/shared/contexts/ToastContext';
import { speciesService } from '../services/speciesService';
import { isHandledGlobally } from '@/shared/lib/http/apiError';

/**
 * Hook para deletar uma espécie
 */
export function useDeleteSpecies() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (id: string) => speciesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['species', 'list'] });
      showSuccess('Espécie excluída com sucesso!');
    },
    onError: (error: Error) => {
      if (isHandledGlobally(error)) return;
      showError(error.message || 'Erro ao excluir espécie. Tente novamente.');
    },
  });
}
