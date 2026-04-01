'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { clientService } from '../services/clientService';

export function useDeleteClient() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (id: string) => clientService.delete(id),
    onSuccess: (_data, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['clients', 'list'] });
      queryClient.removeQueries({ queryKey: ['clients', 'detail', deletedId] });
      showSuccess('Cliente excluído com sucesso!');
      router.push('/company/clients');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao excluir cliente. Tente novamente.');
    },
  });
}

