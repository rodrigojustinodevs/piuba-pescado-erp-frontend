'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import type { UpdateSupplyData } from '../types';
import { supplyService } from '../services/supplyService';

type UseUpdateSupplyOptions = {
  skipNavigateToList?: boolean;
};

export function useUpdateSupply({ skipNavigateToList }: UseUpdateSupplyOptions = {}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: UpdateSupplyData) => supplyService.update(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['supplies', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['supplies', 'detail', data.id] });
      queryClient.invalidateQueries({ queryKey: ['purchaseLookups', 'supplies'] });
      showSuccess('Produto atualizado com sucesso!');
      if (!skipNavigateToList) {
        router.push('/company/supplies');
      }
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao atualizar produto. Tente novamente.');
    },
  });
}

