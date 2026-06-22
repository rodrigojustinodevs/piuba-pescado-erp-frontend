'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/shared/contexts/ToastContext';
import { biometryService } from '../services/biometryService';
import type { CreateBiometryData } from '../types';

type UseCreateBiometryOptions = {
  skipNavigateToList?: boolean;
};

/**
 * Hook para criar uma nova biometria
 */
export function useCreateBiometry(_options: UseCreateBiometryOptions = {}) {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: CreateBiometryData) => biometryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['biometries', 'list'] });
      showSuccess('Biometria criada com sucesso!');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao criar biometria. Tente novamente.');
    },
  });
}
