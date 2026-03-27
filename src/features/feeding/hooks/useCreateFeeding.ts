'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/shared/contexts/ToastContext';
import { feedingService } from '../services/feedingService';
import type { CreateFeedingData } from '../types';

export function useCreateFeeding() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: CreateFeedingData) => feedingService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedings', 'list'] });
      showSuccess('Alimentação criada com sucesso!');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao criar alimentação. Tente novamente.');
    },
  });
}
