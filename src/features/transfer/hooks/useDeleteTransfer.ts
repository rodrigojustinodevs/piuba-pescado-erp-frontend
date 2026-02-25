'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { transferService } from '../services/transferService';

export function useDeleteTransfer() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (id: string) => transferService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers', 'list'] });
      showSuccess('Transferência excluída com sucesso!');
      router.push('/company/transfers');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao excluir transferência. Tente novamente.');
    },
  });
}
