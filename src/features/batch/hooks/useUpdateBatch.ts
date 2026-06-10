'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { batchService } from '../services/batchService';
import type { UpdateBatchData } from '../types';

/**
 * Hook para atualizar um lote existente
 */
export function useUpdateBatch() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: UpdateBatchData) => batchService.update(data),
    onSuccess: (data) => {
      // Invalida queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['batches', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['batches', 'detail', data.id] });

      // Mostra mensagem de sucesso
      showSuccess('Lote atualizado com sucesso!');

      // Redireciona para a página de detalhes
      router.push(`/company/batches`);
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao atualizar lote. Tente novamente.');
    },
  });
}
