'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { harvestService } from '../services/harvestService';
import type { PatchHarvestPayload, UpdateHarvestData } from '../types';

type UseUpdateHarvestOptions = {
  skipNavigateToList?: boolean;
};

export function useUpdateHarvest({ skipNavigateToList }: UseUpdateHarvestOptions = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: UpdateHarvestData | PatchHarvestPayload) => harvestService.update(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['harvests', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['harvests', 'detail', data.id] });
      showSuccess('Despesca atualizada com sucesso!');
      if (!skipNavigateToList) {
        router.push(`/company/disposals/${data.id}`);
      }
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao atualizar despesca. Tente novamente.');
    },
  });
}
