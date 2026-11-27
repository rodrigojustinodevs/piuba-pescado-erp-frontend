'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { waterQualityService } from '../services/waterQualityService';
import type { UpdateWaterQualityData } from '../types';
import { isHandledGlobally } from '@/shared/lib/http/apiError';

export function useUpdateWaterQuality() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: UpdateWaterQualityData) => waterQualityService.update(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['waterQualities', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['waterQualities', 'detail', data.id] });
      showSuccess('Medição atualizada com sucesso!');
      router.refresh();
    },
    onError: (error: Error) => {
      if (isHandledGlobally(error)) return;
      showError(error.message || 'Erro ao atualizar medição. Tente novamente.');
    },
  });
}
