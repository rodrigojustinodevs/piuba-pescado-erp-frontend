'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { mortalityService } from '../services/mortalityService';
import type { UpdateMortalityData } from '../types';

export function useUpdateMortality() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: UpdateMortalityData) => mortalityService.update(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['mortalities', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['mortalities', 'detail', data.id] });
      showSuccess('Mortalidade atualizada com sucesso!');
      router.push('/company/mortalities');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao atualizar mortalidade. Tente novamente.');
    },
  });
}
