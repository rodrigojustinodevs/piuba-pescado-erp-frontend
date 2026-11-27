'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { tankService } from '../services/tankService';
import { isHandledGlobally } from '@/shared/lib/http/apiError';

/**
 * Hook para deletar um tanque
 */
export function useDeleteTank() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (id: string) => tankService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tanks', 'list'] });

      // Mostra mensagem de sucesso
      showSuccess('Tanque excluído com sucesso!');

      router.push('/company/tanks');
    },
    onError: (error: Error) => {
      if (isHandledGlobally(error)) return;
      showError(error.message || 'Erro ao excluir tanque. Tente novamente.');
    },
  });
}
