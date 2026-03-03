'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { stockingService } from '../services/stockingService';

/**
 * Hook para deletar um povoamento
 */
export function useDeleteStocking() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (id: string) => stockingService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stockings', 'list'] });
      showSuccess('Povoamento excluído com sucesso!');
      router.push('/company/stockings');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao excluir povoamento. Tente novamente.');
    },
  });
}
