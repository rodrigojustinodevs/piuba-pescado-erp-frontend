'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { batchService } from '../services/batchService';
import type { CreateBatchData } from '../types';
import { isHandledGlobally } from '@/shared/lib/http/apiError';

/**
 * Hook para criar um novo lote
 */
type UseCreateBatchOptions = {
  skipNavigateToList?: boolean;
};

export function useCreateBatch(options: UseCreateBatchOptions = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: CreateBatchData) => batchService.create(data),
    onSuccess: () => {
      // Invalida a lista de lotes
      queryClient.invalidateQueries({ queryKey: ['batches', 'list'] });

      // Mostra mensagem de sucesso
      showSuccess('Lote criado com sucesso!');

      // Redireciona para a página de listagem
      if (!options.skipNavigateToList) {
        router.push('/company/batches');
      }
    },
    onError: (error: Error) => {
      if (isHandledGlobally(error)) return;
      showError(error.message || 'Erro ao criar lote. Tente novamente.');
    },
  });
}
