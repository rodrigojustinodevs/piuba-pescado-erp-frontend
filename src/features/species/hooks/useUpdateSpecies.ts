'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { speciesService } from '../services/speciesService';
import type { UpdateSpeciesData } from '../types';

/**
 * Hook para atualizar uma espécie existente
 */
export function useUpdateSpecies() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: UpdateSpeciesData) => speciesService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['species', 'list'] });
      showSuccess('Espécie atualizada com sucesso!');
      router.push('/company/species');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao atualizar espécie. Tente novamente.');
    },
  });
}
