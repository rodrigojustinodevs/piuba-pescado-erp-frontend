'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import type { CreateWaterQualityData } from '../types';
import { waterQualityService } from '../services/waterQualityService';

export function useCreateWaterQuality() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: CreateWaterQualityData) => waterQualityService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waterQualities', 'list'] });
      showSuccess('Medição registrada com sucesso!');
      router.push('/company/water-qualities');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao registrar medição. Tente novamente.');
    },
  });
}
