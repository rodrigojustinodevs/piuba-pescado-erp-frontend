'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { biometryService } from '../services/biometryService';
import type { UpdateBiometryData } from '../types';

/**
 * Hook para atualizar uma biometria
 */
export function useUpdateBiometry() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: UpdateBiometryData) => biometryService.update(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['biometries', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['biometries', 'detail', data.id] });
      showSuccess('Biometria atualizada com sucesso!');
      router.push('/company/biometries');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao atualizar biometria. Tente novamente.');
    },
  });
}
