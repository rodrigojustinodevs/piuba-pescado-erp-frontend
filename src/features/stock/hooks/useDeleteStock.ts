'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { stockService } from '../services/stockService';

export function useDeleteStock() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (id: string) => stockService.delete(id),
    onSuccess: (_data, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['stocks', 'list'] });
      queryClient.removeQueries({ queryKey: ['stocks', 'detail', deletedId] });
      showSuccess('Estoque excluído com sucesso!');
      router.push('/company/stocks');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao excluir estoque. Tente novamente.');
    },
  });
}
