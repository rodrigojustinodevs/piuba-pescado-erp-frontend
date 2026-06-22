'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { harvestService } from '../services/harvestService';
import type { CreateHarvestData } from '../types';

type UseCreateHarvestOptions = {
  skipNavigateToList?: boolean;
};

export function useCreateHarvest({ skipNavigateToList }: UseCreateHarvestOptions = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: CreateHarvestData) => harvestService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['harvests', 'list'] });
      showSuccess('Despesca criada com sucesso!');
      if (!skipNavigateToList) {
        router.push('/company/disposals');
      }
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao criar despesca. Tente novamente.');
    },
  });
}
