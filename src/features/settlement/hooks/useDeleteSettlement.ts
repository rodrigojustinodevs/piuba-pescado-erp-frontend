'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { settlementService } from '../services/settlementService';

/**
 * Hook para deletar um povoamento
 */
export function useDeleteSettlement() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (id: string) => settlementService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settlements', 'list'] });
      showSuccess('Povoamento excluído com sucesso!');
      router.push('/company/settlements');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao excluir povoamento. Tente novamente.');
    },
  });
}
