'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { tankService } from '../services/tankService';
import type { CreateTankData } from '../types';

/**
 * Hook para criar um novo tanque
 */
export function useCreateTank() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: CreateTankData) => tankService.create(data),
    onSuccess: (data) => {
      // Invalida a lista de tanques
      queryClient.invalidateQueries({ queryKey: ['tanks', 'list'] });

      // Mostra mensagem de sucesso
      showSuccess('Tanque criado com sucesso!');

      // Redireciona para a página de detalhes
      router.push(`/company/tanks/${data.id}`);
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao criar tanque. Tente novamente.');
    },
  });
}
