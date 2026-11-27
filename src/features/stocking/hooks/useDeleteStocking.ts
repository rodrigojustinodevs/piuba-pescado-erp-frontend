'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { stockingService } from '../services/stockingService';
import { isHandledGlobally } from '@/shared/lib/http/apiError';

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
      if (isHandledGlobally(error)) return;
      showError(error.message || 'Erro ao excluir povoamento. Tente novamente.');
    },
  });
}
