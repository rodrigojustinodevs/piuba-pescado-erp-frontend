'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { feedingService } from '../services/feedingService';
import type { UpdateFeedingData } from '../types';

export function useUpdateFeeding() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: UpdateFeedingData) => feedingService.update(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['feedings', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['feedings', 'detail', data.id] });
      showSuccess('Alimentação atualizada com sucesso!');
      router.push('/company/feedings');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao atualizar alimentação. Tente novamente.');
    },
  });
}
