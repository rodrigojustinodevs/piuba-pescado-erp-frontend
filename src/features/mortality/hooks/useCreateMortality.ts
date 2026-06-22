'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/shared/contexts/ToastContext';
import { mortalityService } from '../services/mortalityService';
import type { CreateMortalityData } from '../types';

type UseCreateMortalityOptions = {
  skipNavigateToList?: boolean;
};

export function useCreateMortality(_options: UseCreateMortalityOptions = {}) {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: CreateMortalityData) => mortalityService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mortalities', 'list'] });
      showSuccess('Mortalidade criada com sucesso!');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao criar mortalidade. Tente novamente.');
    },
  });
}
