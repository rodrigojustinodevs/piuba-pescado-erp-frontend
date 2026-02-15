'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { tankService } from '../services/tankService';
import type { UpdateTankData } from '../types';

/**
 * Hook para atualizar um tanque existente
 */
export function useUpdateTank() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: UpdateTankData) => tankService.update(data),
    onSuccess: (data) => {
      // Invalida queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['tanks', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['tanks', 'detail', data.id] });

      // Mostra mensagem de sucesso
      showSuccess('Tanque atualizado com sucesso!');

      // Redireciona para a página de detalhes
      router.push(`/company/tanks/${data.id}`);
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao atualizar tanque. Tente novamente.');
    },
  });
}
