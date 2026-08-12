'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { speciesService } from '../services/speciesService';
import type { CreateSpeciesData } from '../types';

/**
 * Hook para criar uma nova espécie
 */
export function useCreateSpecies() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: CreateSpeciesData) => speciesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['species', 'list'] });
      showSuccess('Espécie criada com sucesso!');
      router.push('/company/species');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao criar espécie. Tente novamente.');
    },
  });
}
