'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { batchService } from '../services/batchService';
import { isHandledGlobally } from '@/shared/lib/http/apiError';

/**
 * Hook para deletar um lote
 */
export function useDeleteBatch() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (id: string) => batchService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches', 'list'] });

      // Mostra mensagem de sucesso
      showSuccess('Lote excluído com sucesso!');

      router.push('/company/batches');
    },
    onError: (error: Error) => {
      if (isHandledGlobally(error)) return;
      showError(error.message || 'Erro ao excluir lote. Tente novamente.');
    },
  });
}
