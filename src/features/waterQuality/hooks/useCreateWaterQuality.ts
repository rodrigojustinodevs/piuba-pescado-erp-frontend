'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import type { CreateWaterQualityData } from '../types';
import { waterQualityService } from '../services/waterQualityService';

export type UseCreateWaterQualityOptions = {
  /** Quando true, apenas invalida cache e dá refresh na rota atual (ex.: dialog na lista). */
  skipNavigateToList?: boolean;
};

export function useCreateWaterQuality(options?: UseCreateWaterQualityOptions) {
  const skipNavigateToList = options?.skipNavigateToList ?? false;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: CreateWaterQualityData) => waterQualityService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waterQualities', 'list'] });
      showSuccess('Medição registrada com sucesso!');
      if (skipNavigateToList) {
        router.refresh();
      } else {
        router.push('/company/water-qualities');
      }
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao registrar medição. Tente novamente.');
    },
  });
}
