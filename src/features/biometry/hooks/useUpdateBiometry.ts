'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { biometryService } from '../services/biometryService';
import type { UpdateBiometryData } from '../types';

type UseUpdateBiometryOptions = {
  skipNavigateToList?: boolean;
};

/**
 * Hook para atualizar uma biometria
 */
export function useUpdateBiometry(options: UseUpdateBiometryOptions = {}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: UpdateBiometryData) => biometryService.update(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['biometries', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['biometries', 'detail', data.id] });
      showSuccess('Biometria atualizada com sucesso!');
      if (!options.skipNavigateToList) {
        router.push('/company/biometries');
      }
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao atualizar biometria. Tente novamente.');
    },
  });
}
