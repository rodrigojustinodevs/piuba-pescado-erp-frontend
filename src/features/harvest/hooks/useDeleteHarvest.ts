'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { harvestService } from '../services/harvestService';

export function useDeleteHarvest() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (id: string) => harvestService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['harvests', 'list'] });
      showSuccess('Despesca excluída com sucesso!');
      router.push('/company/disposals');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao excluir despesca. Tente novamente.');
    },
  });
}
